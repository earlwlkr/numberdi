import { internalMutation } from "./_generated/server";

const ONE_HOUR = 60 * 60 * 1000;

export const deleteStale = internalMutation({
  handler: async (ctx) => {
    const cutoff = Date.now() - ONE_HOUR;

    const sessions = await ctx.db.query("sessions").collect();
    let deleted = 0;

    for (const session of sessions) {
      // Only delete if no activity for over an hour
      const lastActivity = session.lastActivityAt ?? session._creationTime;
      if (lastActivity > cutoff) continue;

      // Delete all claims for this session
      const claims = await ctx.db
        .query("claims")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const claim of claims) {
        await ctx.db.delete(claim._id);
      }

      // Delete all players for this session
      const players = await ctx.db
        .query("players")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const player of players) {
        await ctx.db.delete(player._id);
      }

      // Delete the session
      await ctx.db.delete(session._id);
      deleted++;
    }

    if (deleted > 0) {
      console.log(`Cleaned up ${deleted} stale sessions`);
    }
  },
});

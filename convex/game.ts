import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const claimNumber = mutation({
  args: {
    sessionId: v.id("sessions"),
    playerId: v.string(),
    number: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.status !== "playing") return { success: false, reason: "not_playing" };

    // Get all claims for this session
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const claimedNumbers = new Set(claims.map((c) => c.number));

    // Check if this number is already claimed
    if (claimedNumbers.has(args.number)) {
      return { success: false, reason: "already_claimed" };
    }

    // Get the player
    const player = await ctx.db
      .query("players")
      .withIndex("by_session_player", (q) =>
        q.eq("sessionId", args.sessionId).eq("playerId", args.playerId)
      )
      .first();
    if (!player) return { success: false, reason: "player_not_found" };

    // Auto-advance nextTarget past claimed numbers
    let target = player.nextTarget;
    while (claimedNumbers.has(target) && target <= session.maxNumber) {
      target++;
    }

    // Verify this is the player's current target
    if (args.number !== target) {
      return { success: false, reason: "wrong_number" };
    }

    // Claim it
    await ctx.db.insert("claims", {
      sessionId: args.sessionId,
      number: args.number,
      playerId: args.playerId,
      playerName: player.name,
      colorIndex: player.colorIndex,
      claimedAt: Date.now(),
    });

    // Find next unclaimed target
    let nextTarget = args.number + 1;
    while (claimedNumbers.has(nextTarget) && nextTarget <= session.maxNumber) {
      nextTarget++;
    }

    await ctx.db.patch(player._id, {
      score: player.score + 1,
      nextTarget,
    });

    // Check if game is over (all numbers claimed)
    if (claims.length + 1 >= session.maxNumber) {
      await ctx.db.patch(args.sessionId, { status: "finished" });
    }

    return { success: true };
  },
});

export const getClaims = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("claims")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

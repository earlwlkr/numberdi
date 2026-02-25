import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const join = mutation({
  args: {
    sessionId: v.id("sessions"),
    playerId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already joined
    const existing = await ctx.db
      .query("players")
      .withIndex("by_session_player", (q) =>
        q.eq("sessionId", args.sessionId).eq("playerId", args.playerId)
      )
      .first();
    if (existing) return existing._id;

    // Assign next color index
    const players = await ctx.db
      .query("players")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const id = await ctx.db.insert("players", {
      sessionId: args.sessionId,
      playerId: args.playerId,
      name: args.name,
      colorIndex: players.length,
      score: 0,
      nextTarget: 1,
    });
    await ctx.db.patch(args.sessionId, { lastActivityAt: Date.now() });
    return id;
  },
});

export const list = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const getMe = query({
  args: { sessionId: v.id("sessions"), playerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .withIndex("by_session_player", (q) =>
        q.eq("sessionId", args.sessionId).eq("playerId", args.playerId)
      )
      .first();
  },
});

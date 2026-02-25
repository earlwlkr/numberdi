import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const create = mutation({
  args: { hostPlayerId: v.string(), maxNumber: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const code = generateCode();
    const seed = Math.floor(Math.random() * 2147483647);
    const id = await ctx.db.insert("sessions", {
      code,
      status: "lobby",
      maxNumber: args.maxNumber ?? 100,
      seed,
      hostPlayerId: args.hostPlayerId,
    });
    return { id, code };
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
    return session;
  },
});

export const get = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const startCountdown = mutation({
  args: { sessionId: v.id("sessions"), playerId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostPlayerId !== args.playerId) throw new Error("Only host can start");
    if (session.status !== "lobby") throw new Error("Game already started");

    await ctx.db.patch(args.sessionId, { status: "countdown", startedAt: Date.now() });
    await ctx.scheduler.runAfter(4000, internal.sessions.startGame, {
      sessionId: args.sessionId,
    });
  },
});

export const startGame = internalMutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.status !== "countdown") return;
    await ctx.db.patch(args.sessionId, { status: "playing" });
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    code: v.string(),
    status: v.union(
      v.literal("lobby"),
      v.literal("countdown"),
      v.literal("playing"),
      v.literal("finished")
    ),
    maxNumber: v.number(),
    seed: v.number(),
    hostPlayerId: v.string(),
    startedAt: v.optional(v.number()),
  }).index("by_code", ["code"]),

  players: defineTable({
    sessionId: v.id("sessions"),
    playerId: v.string(),
    name: v.string(),
    colorIndex: v.number(),
    score: v.number(),
    nextTarget: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_session_player", ["sessionId", "playerId"]),

  claims: defineTable({
    sessionId: v.id("sessions"),
    number: v.number(),
    playerId: v.string(),
    playerName: v.string(),
    colorIndex: v.number(),
    claimedAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_session_number", ["sessionId", "number"]),
});

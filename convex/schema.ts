import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  designFiles: defineTable({
    ownerId: v.string(), // User email as unique identifier
    ownerName: v.string(),
    title: v.string(),
    shareLink: v.string(), // Unique shareable link ID
    collaborators: v.array(v.object({
      email: v.string(),
      name: v.string(),
      invitedAt: v.number(),
    })),
    shapes: v.array(v.object({
      id: v.string(),
      type: v.string(),
      height: v.number(),
      width: v.number(),
      coordX: v.number(),
      coordY: v.number(),
      // Optional properties for specific shape types
      startX: v.optional(v.number()),
      startY: v.optional(v.number()),
      endX: v.optional(v.number()),
      endY: v.optional(v.number()),
      thickness: v.optional(v.number()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_share_link", ["shareLink"]),

  activeCollaborators: defineTable({
    designFileId: v.id("designFiles"),
    email: v.string(),
    name: v.string(),
    lastSeenAt: v.number(),
  })
    .index("by_design_file", ["designFileId"])
    .index("by_design_and_email", ["designFileId", "email"]),
});

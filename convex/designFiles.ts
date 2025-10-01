import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a unique shareable link ID
function generateShareLink(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Create a new design file
export const createDesignFile = mutation({
  args: {
    ownerId: v.string(),
    ownerName: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const shareLink = generateShareLink();
    const designFileId = await ctx.db.insert("designFiles", {
      ownerId: args.ownerId,
      ownerName: args.ownerName,
      title: args.title,
      shareLink,
      collaborators: [],
      shapes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { designFileId, shareLink };
  },
});

// Get design file by owner ID (email)
export const getDesignFileByOwner = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    const designFile = await ctx.db
      .query("designFiles")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .first();
    return designFile;
  },
});

// Get design file by share link
export const getDesignFileByShareLink = query({
  args: { shareLink: v.string() },
  handler: async (ctx, args) => {
    const designFile = await ctx.db
      .query("designFiles")
      .withIndex("by_share_link", (q) => q.eq("shareLink", args.shareLink))
      .first();
    return designFile;
  },
});

// Update shapes in design file
export const updateShapes = mutation({
  args: {
    designFileId: v.id("designFiles"),
    shapes: v.array(v.object({
      id: v.string(),
      type: v.string(),
      height: v.number(),
      width: v.number(),
      coordX: v.number(),
      coordY: v.number(),
      startX: v.optional(v.number()),
      startY: v.optional(v.number()),
      endX: v.optional(v.number()),
      endY: v.optional(v.number()),
      thickness: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.designFileId, {
      shapes: args.shapes,
      updatedAt: Date.now(),
    });
  },
});

// Add collaborator to design file (max 3 collaborators)
export const addCollaborator = mutation({
  args: {
    designFileId: v.id("designFiles"),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const designFile = await ctx.db.get(args.designFileId);
    if (!designFile) {
      throw new Error("Design file not found");
    }

    // Check if already has 3 collaborators
    if (designFile.collaborators.length >= 3) {
      throw new Error("Maximum of 3 collaborators allowed");
    }

    // Check if collaborator already exists
    const existingCollaborator = designFile.collaborators.find(
      (c) => c.email === args.email
    );
    if (existingCollaborator) {
      throw new Error("Collaborator already added");
    }

    // Add new collaborator
    await ctx.db.patch(args.designFileId, {
      collaborators: [
        ...designFile.collaborators,
        {
          email: args.email,
          name: args.name,
          invitedAt: Date.now(),
        },
      ],
      updatedAt: Date.now(),
    });
  },
});

// Mark collaborator as active (for presence tracking)
export const markCollaboratorActive = mutation({
  args: {
    designFileId: v.id("designFiles"),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already active
    const existing = await ctx.db
      .query("activeCollaborators")
      .withIndex("by_design_and_email", (q) =>
        q.eq("designFileId", args.designFileId).eq("email", args.email)
      )
      .first();

    if (existing) {
      // Update last seen
      await ctx.db.patch(existing._id, {
        lastSeenAt: Date.now(),
      });
    } else {
      // Insert new active collaborator
      await ctx.db.insert("activeCollaborators", {
        designFileId: args.designFileId,
        email: args.email,
        name: args.name,
        lastSeenAt: Date.now(),
      });
    }
  },
});

// Get active collaborators (seen in last 30 seconds)
export const getActiveCollaborators = query({
  args: { designFileId: v.id("designFiles") },
  handler: async (ctx, args) => {
    const thirtySecondsAgo = Date.now() - 30000;
    const activeCollaborators = await ctx.db
      .query("activeCollaborators")
      .withIndex("by_design_file", (q) => q.eq("designFileId", args.designFileId))
      .collect();

    // Filter to only those seen in last 30 seconds
    return activeCollaborators.filter((c) => c.lastSeenAt > thirtySecondsAgo);
  },
});

// Clean up inactive collaborators (older than 1 minute)
export const cleanupInactiveCollaborators = mutation({
  args: { designFileId: v.id("designFiles") },
  handler: async (ctx, args) => {
    const oneMinuteAgo = Date.now() - 60000;
    const activeCollaborators = await ctx.db
      .query("activeCollaborators")
      .withIndex("by_design_file", (q) => q.eq("designFileId", args.designFileId))
      .collect();

    for (const collaborator of activeCollaborators) {
      if (collaborator.lastSeenAt < oneMinuteAgo) {
        await ctx.db.delete(collaborator._id);
      }
    }
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.optional(v.string()),
        email: v.string(),
        password: v.string(), // In a real app, hash this!
        role: v.string(), // 'admin' or 'customer'
        dogName: v.optional(v.string()),
        dogBreed: v.optional(v.string()),
    }).index("by_email", ["email"]),
    bookings: defineTable({
        userId: v.string(), // Keeping as string for flexibility with frontend IDs
        serviceName: v.string(),
        bookingDate: v.string(),
        notes: v.optional(v.string()),
        status: v.string(), // 'pending', 'active', etc.
        createdAt: v.number(),
    }),
    foodStock: defineTable({
        brand: v.string(),
        formula: v.string(),
        level: v.number(),
        threshold: v.number(),
    }),
    activities: defineTable({
        dogName: v.string(),
        activity: v.string(),
        time: v.string(),
        date: v.string(),
        status: v.string(), // 'pending', 'active', 'scheduled'
        type: v.string(), // 'today', 'week', 'month'
    }),
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
    },
});

export const createUser = mutation({
    args: {
        name: v.optional(v.string()),
        email: v.string(),
        password: v.string(),
        role: v.string(),
        dogName: v.optional(v.string()),
        dogBreed: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
        if (existing) {
            throw new Error("User already exists");
        }
        return await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            password: args.password,
            role: args.role,
            dogName: args.dogName,
            dogBreed: args.dogBreed,
        });
    },
});

export const seedUsers = mutation({
    handler: async (ctx) => {
        const users = [
            { name: "Admin", email: "admin@dogcamp.com", password: "admin123", role: "admin" },
            { name: "John Doe", email: "john@example.com", password: "password", role: "customer" },
        ];

        for (const user of users) {
            const existing = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", user.email))
                .unique();
            if (!existing) {
                await ctx.db.insert("users", user);
            }
        }
    },
});

export const createBooking = mutation({
    args: {
        userId: v.string(),
        serviceName: v.string(),
        bookingDate: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("bookings", {
            userId: args.userId,
            serviceName: args.serviceName,
            bookingDate: args.bookingDate,
            notes: args.notes || "",
            status: "pending",
            createdAt: Date.now(),
        });
    },
});

// Admin Queries
export const getAllBookings = query({
    handler: async (ctx) => {
        return await ctx.db.query("bookings").order("desc").collect();
    },
});

export const getAllUsers = query({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

export const getFoodStock = query({
    handler: async (ctx) => {
        return await ctx.db.query("foodStock").collect();
    },
});

export const getActivities = query({
    handler: async (ctx) => {
        return await ctx.db.query("activities").collect();
    },
});

// Admin Mutations
export const updateStock = mutation({
    args: { id: v.id("foodStock"), level: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { level: args.level });
    },
});

export const seedAdminData = mutation({
    handler: async (ctx) => {
        // Seed Stock
        const stocks = [
            { brand: 'Royal Canin', formula: 'Puppy Maxi', level: 45, threshold: 20 },
            { brand: 'Purina Pro Plan', formula: 'Adult Sensitive', level: 15, threshold: 25 },
            { brand: 'Orijen', formula: 'Original All Life Stages', level: 60, threshold: 15 },
            { brand: 'Taste of the Wild', formula: 'High Prairie', level: 8, threshold: 10 },
        ];
        for (const s of stocks) {
            const existing = await ctx.db.query("foodStock").filter(q => q.eq(q.field("brand"), s.brand)).unique();
            if (!existing) await ctx.db.insert("foodStock", s);
        }

        // Seed Activities
        const acts = [
            { dogName: 'Buddy', activity: 'Grooming', time: '10:00 AM', date: 'Today', status: 'pending', type: 'today' },
            { dogName: 'Buddy', activity: 'Walk', time: '02:00 PM', date: 'Today', status: 'scheduled', type: 'today' },
            { dogName: 'Buddy', activity: 'Breakfast Meal', time: '08:00 AM', date: 'Today', status: 'served', type: 'today' },
            { dogName: 'Buddy', activity: 'Lunch Meal', time: '01:00 PM', date: 'Today', status: 'served', type: 'today' },
            { dogName: 'Buddy', activity: 'Dinner Meal', time: '07:00 PM', date: 'Today', status: 'pending', type: 'today' },
            { dogName: 'Luna', activity: 'Training', time: '11:30 AM', date: 'Today', status: 'active', type: 'today' },
            { dogName: 'Luna', activity: 'Breakfast Meal', time: '08:30 AM', date: 'Today', status: 'served', type: 'today' },
            { dogName: 'Max', activity: 'Vet Visit', time: '-', date: 'Tue, 14 Jan', status: 'scheduled', type: 'week' },
        ];
        for (const a of acts) {
            const existing = await ctx.db.query("activities").filter(q => q.and(q.eq(q.field("dogName"), a.dogName), q.eq(q.field("activity"), a.activity))).unique();
            if (!existing) await ctx.db.insert("activities", a);
        }
    }
});
// Customer Queries
export const getDogActivities = query({
    args: { dogName: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("activities")
            .filter((q) => q.eq(q.field("dogName"), args.dogName))
            .collect();
    },
});

export const updateActivityStatus = mutation({
    args: { id: v.id("activities"), status: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

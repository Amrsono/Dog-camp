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

        // Seed Bookings
        const bookings = [
            { userId: "admin@dogcamp.com", serviceName: "Luxury Hosting", bookingDate: "2024-01-20", status: "confirmed", createdAt: Date.now() },
            { userId: "john@example.com", serviceName: "Training Boot Camp", bookingDate: "2024-01-22", status: "pending", createdAt: Date.now() },
        ];
        for (const b of bookings) {
            const existing = await ctx.db.query("bookings").filter(q => q.and(q.eq(q.field("userId"), b.userId), q.eq(q.field("serviceName"), b.serviceName))).unique();
            if (!existing) await ctx.db.insert("bookings", b);
        }

        // Seed Services
        const services = [
            { key: 'luxuryHosting', name: 'Luxury Hosting', price: 2500, category: 'hosting' },
            { key: 'gourmetFeeding', name: 'Gourmet Feeding', price: 750, category: 'food' },
            { key: 'fullGrooming', name: 'Full Grooming', price: 3000, category: 'grooming' },
            { key: 'trainingBootCamp', name: 'Training Boot Camp', price: 5000, category: 'training' },
            { key: 'vetTeleHealth', name: 'Vet TeleHealth', price: 1500, category: 'health' },
            { key: 'playGroup', name: 'Play Group', price: 1000, category: 'social' },
        ];
        for (const s of services) {
            const existing = await ctx.db.query("services").filter(q => q.eq(q.field("key"), s.key)).unique();
            if (!existing) await ctx.db.insert("services", s);
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

export const addActivity = mutation({
    args: {
        dogName: v.string(),
        activity: v.string(),
        time: v.string(),
        date: v.string(),
        status: v.string(),
        type: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("activities", args);
    },
});

export const updateFullActivity = mutation({
    args: {
        id: v.id("activities"),
        dogName: v.string(),
        activity: v.string(),
        time: v.string(),
        date: v.string(),
        status: v.string(),
        type: v.string()
    },
    handler: async (ctx, args) => {
        const { id, ...data } = args;
        await ctx.db.patch(id, data);
    },
});

export const addFoodStock = mutation({
    args: {
        brand: v.string(),
        formula: v.string(),
        level: v.number(),
        threshold: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("foodStock", args);
    },
});

export const getServices = query({
    handler: async (ctx) => {
        return await ctx.db.query("services").collect();
    },
});

export const updateServicePrice = mutation({
    args: { id: v.id("services"), price: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { price: args.price });
    },
});

export const updateBooking = mutation({
    args: {
        id: v.id("bookings"),
        status: v.string(),
        serviceName: v.optional(v.string()),
        bookingDate: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { id, ...data } = args;
        await ctx.db.patch(id, data);
    },
});

export const getFullBookings = query({
    handler: async (ctx) => {
        const bookings = await ctx.db.query("bookings").order("desc").collect();
        const results = [];
        for (const booking of bookings) {
            const user = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("email"), booking.userId)) // We currently store email as userId in API
                .unique();

            // Try fetching by ID if no user found by email (backward compatibility)
            const userById = !user ? await ctx.db.get(booking.userId) : null;

            results.push({
                ...booking,
                userName: user?.name || userById?.name || "Unknown User",
                dogName: user?.dogName || userById?.dogName || "N/A",
            });
        }
        return results;
    },
});

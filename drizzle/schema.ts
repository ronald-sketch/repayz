import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /**
   * Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user.
   * This mirrors the Manus account and should be used for authentication lookups.
   */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Recycling contributions table - tracks each user's recycling activities
 */
export const recyclingContributions = mysqlTable("recycling_contributions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bottleCount: int("bottleCount").default(0).notNull(),
  canCount: int("canCount").default(0).notNull(),
  totalWeight: int("totalWeight").default(0).notNull(), // in grams
  earnedAmount: int("earnedAmount").default(0).notNull(), // in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RecyclingContribution = typeof recyclingContributions.$inferSelect;
export type InsertRecyclingContribution = typeof recyclingContributions.$inferInsert;

/**
 * Weekly leaderboard aggregation - denormalized for performance
 */
export const weeklyLeaderboard = mysqlTable("weekly_leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: text("userName").notNull(),
  weekStartDate: timestamp("weekStartDate").notNull(),
  totalBottles: int("totalBottles").default(0).notNull(),
  totalCans: int("totalCans").default(0).notNull(),
  totalWeight: int("totalWeight").default(0).notNull(),
  totalEarned: int("totalEarned").default(0).notNull(),
  rank: int("rank").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeeklyLeaderboard = typeof weeklyLeaderboard.$inferSelect;
export type InsertWeeklyLeaderboard = typeof weeklyLeaderboard.$inferInsert;

/**
 * Machine status table - stores real-time status from the RVM API
 */
export const machineStatus = mysqlTable("machine_status", {
  id: int("id").autoincrement().primaryKey(),
  machineId: varchar("machineId", { length: 64 }).notNull().unique(),
  status: mysqlEnum("status", ["operational", "error", "door_open", "maintenance", "offline", "full"]).default("operational").notNull(),
  statusInfoState: varchar("statusInfoState", { length: 50 }).default(""), // Raw ePortal StatusInfoState (Error, Ready, Door, Door(Tech))
  bottleCapacity: int("bottleCapacity").default(100).notNull(),
  canCapacity: int("canCapacity").default(100).notNull(),
  bottlesCount: int("bottlesCount").default(0).notNull(),
  cansCount: int("cansCount").default(0).notNull(),
  temperature: int("temperature"), // in celsius
  // Last known good values from ePortal API (persistent fallback)
  lastKnownCounter: int("lastKnownCounter").default(0).notNull(), // Total all-time items
  lastKnownBottles: int("lastKnownBottles").default(0).notNull(), // BinInfoCountBin2
  lastKnownCans: int("lastKnownCans").default(0).notNull(), // BinInfoCountBin1
  lastApiSuccess: timestamp("lastApiSuccess"), // When API last worked
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MachineStatus = typeof machineStatus.$inferSelect;
export type InsertMachineStatus = typeof machineStatus.$inferInsert;

/**
 * Location information - stores RVM location details
 */
export const locations = mysqlTable("locations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  openingHours: varchar("openingHours", { length: 100 }).notNull(), // e.g., "10:00-21:00"
  machineId: varchar("machineId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

/**
 * Welfare partners - organizations supported by REPAYZ
 */
export const welfarePartners = mysqlTable("welfare_partners", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address"),
  website: varchar("website", { length: 255 }),
  logo: varchar("logo", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WelfarePartner = typeof welfarePartners.$inferSelect;
export type InsertWelfarePartner = typeof welfarePartners.$inferInsert;

/**
 * Recycling sessions - tracks active and completed recycling sessions
 * Used for live gamification with counter-based tracking
 */
export const recyclingSessions = mysqlTable("recycling_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userName: varchar("userName", { length: 255 }).notNull(),
  userEmail: varchar("userEmail", { length: 320 }),
  userId: int("userId"), // Optional - for logged-in users
  machineId: varchar("machineId", { length: 64 }).notNull(),
  startCount: int("startCount").notNull(), // Total counter when session started
  endCount: int("endCount"), // Total counter when session ended (null if active)
  bottleCount: int("bottleCount").default(0), // Calculated: bottles added during session
  canCount: int("canCount").default(0), // Calculated: cans added during session
  totalItems: int("totalItems").default(0), // Calculated: endCount - startCount
  status: mysqlEnum("status", ["active", "completed", "timeout", "cancelled"]).default("active").notNull(),
  startTime: timestamp("startTime").defaultNow().notNull(),
  endTime: timestamp("endTime"),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(), // Updated when counter changes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecyclingSession = typeof recyclingSessions.$inferSelect;
export type InsertRecyclingSession = typeof recyclingSessions.$inferInsert;

/**
 * Drops table - tracks detected counter increases that can be claimed
 * Replaces session-based system with simpler claim-based flow
 */
export const drops = mysqlTable("drops", {
  id: int("id").autoincrement().primaryKey(),
  machineId: varchar("machineId", { length: 64 }).notNull(),
  previousCount: int("previousCount").notNull(), // Counter before drop
  newCount: int("newCount").notNull(), // Counter after drop
  itemsAdded: int("itemsAdded").notNull(), // newCount - previousCount
  claimedBy: varchar("claimedBy", { length: 255 }).default("Scooterpoint").notNull(), // Defaults to Scooterpoint
  claimedAt: timestamp("claimedAt"), // Null if not claimed yet
  status: mysqlEnum("status", ["pending", "claimed", "expired"]).default("pending").notNull(),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(), // 60 seconds after detection
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Drop = typeof drops.$inferSelect;
export type InsertDrop = typeof drops.$inferInsert;

/**
 * Pending drop - single slot queue for tracking who's about to drop
 * Only 1 person can be in queue at a time
 */
export const pendingDrop = mysqlTable("pending_drop", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  machineId: varchar("machineId", { length: 64 }).notNull().default("090373"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(), // 15 minutes from creation
});

export type PendingDrop = typeof pendingDrop.$inferSelect;
export type InsertPendingDrop = typeof pendingDrop.$inferInsert;

/**
 * Drops history - completed drops with assigned names
 */
export const dropsHistory = mysqlTable("drops_history", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  machineId: varchar("machineId", { length: 64 }).notNull(),
  itemsCount: int("itemsCount").notNull(),
  previousCounter: int("previousCounter").notNull(),
  newCounter: int("newCounter").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
});

export type DropsHistory = typeof dropsHistory.$inferSelect;
export type InsertDropsHistory = typeof dropsHistory.$inferInsert;

/**
 * Lifetime counters - tracks cumulative totals with historical baseline
 * Used to calculate split between PET bottles and cans for all-time display
 */
export const lifetimeCounters = mysqlTable("lifetime_counters", {
  id: int("id").autoincrement().primaryKey(),
  machineId: varchar("machineId", { length: 64 }).notNull().unique(),
  // Baseline values from historical data (before tracking started)
  baselineBottles: int("baselineBottles").default(0).notNull(), // PET bottles baseline
  baselineCans: int("baselineCans").default(0).notNull(), // Cans baseline
  baselineTotal: int("baselineTotal").default(0).notNull(), // Total at baseline
  // Accumulated values since tracking started
  accumulatedBottles: int("accumulatedBottles").default(0).notNull(),
  accumulatedCans: int("accumulatedCans").default(0).notNull(),
  // Last known daily values (to detect resets)
  lastDailyBottles: int("lastDailyBottles").default(0).notNull(),
  lastDailyCans: int("lastDailyCans").default(0).notNull(),
  // Timestamps
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LifetimeCounter = typeof lifetimeCounters.$inferSelect;
export type InsertLifetimeCounter = typeof lifetimeCounters.$inferInsert;


/**
 * A/B Test Variants - defines different popup text variants
 */
export const abTestVariants = mysqlTable("ab_test_variants", {
  id: int("id").autoincrement().primaryKey(),
  testName: varchar("testName", { length: 100 }).notNull(), // e.g., "popup_welcome"
  variantKey: varchar("variantKey", { length: 10 }).notNull(), // "A" or "B"
  title: varchar("title", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  description1: text("description1").notNull(),
  highlight1: varchar("highlight1", { length: 255 }).notNull(),
  description2: text("description2").notNull(),
  highlight2: varchar("highlight2", { length: 255 }).notNull(),
  primaryButtonText: varchar("primaryButtonText", { length: 100 }).notNull(),
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AbTestVariant = typeof abTestVariants.$inferSelect;
export type InsertAbTestVariant = typeof abTestVariants.$inferInsert;

/**
 * A/B Test Events - tracks impressions and conversions
 */
export const abTestEvents = mysqlTable("ab_test_events", {
  id: int("id").autoincrement().primaryKey(),
  testName: varchar("testName", { length: 100 }).notNull(),
  variantKey: varchar("variantKey", { length: 10 }).notNull(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(), // Anonymous visitor ID from localStorage
  eventType: mysqlEnum("eventType", ["impression", "conversion", "dismiss"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AbTestEvent = typeof abTestEvents.$inferSelect;
export type InsertAbTestEvent = typeof abTestEvents.$inferInsert;

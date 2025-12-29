import { eq, desc, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, recyclingContributions, weeklyLeaderboard, machineStatus, locations, welfarePartners, recyclingSessions, InsertRecyclingSession, RecyclingSession, drops, InsertDrop, Drop, abTestVariants, abTestEvents, InsertAbTestEvent, AbTestEvent, AbTestVariant } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      console.log("[Database] Connecting with URL:", process.env.DATABASE_URL?.substring(0, 30) + "...");
      _db = drizzle(process.env.DATABASE_URL);
      console.log("[Database] ✅ Connected successfully");
    } catch (error) {
      console.warn("[Database] ❌ Failed to connect:", error);
      _db = null;
    }
  } else if (!process.env.DATABASE_URL) {
    console.warn("[Database] ⚠️ DATABASE_URL not set!");
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Alias for compatibility with sdk.ts
export const getUserByOpenId = getUser;

// ============= Recycling Contributions =============

export async function addRecyclingContribution(userId: number, bottleCount: number, canCount: number, weight: number, earnedAmount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(recyclingContributions).values({
    userId,
    bottleCount,
    canCount,
    totalWeight: weight,
    earnedAmount,
  });
}

export async function getUserContributions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(recyclingContributions).where(eq(recyclingContributions.userId, userId));
}

// ============= Weekly Leaderboard =============

export async function getWeeklyLeaderboard(weekStartDate: Date) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(weeklyLeaderboard)
    .where(eq(weeklyLeaderboard.weekStartDate, weekStartDate))
    .orderBy(asc(weeklyLeaderboard.rank));
}

export async function getCurrentWeekLeaderboard() {
  const db = await getDb();
  if (!db) return [];

  // Get current week's Monday
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(today.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  return await db.select()
    .from(weeklyLeaderboard)
    .where(eq(weeklyLeaderboard.weekStartDate, weekStart))
    .orderBy(asc(weeklyLeaderboard.rank));
}

// ============= Machine Status =============

export async function getMachineStatus(machineId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(machineStatus).where(eq(machineStatus.machineId, machineId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function saveLastKnownCounter(machineId: string, bottles: number, cans: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save last known counter: database not available");
    return;
  }

  try {
    const total = bottles + cans;
    const existing = await getMachineStatus(machineId);
    
    if (existing) {
      await db.update(machineStatus)
        .set({
          lastKnownCounter: total,
          lastKnownBottles: bottles,
          lastKnownCans: cans,
          lastApiSuccess: new Date(),
          lastUpdated: new Date(),
        })
        .where(eq(machineStatus.machineId, machineId));
      console.log(`[Database] ✅ Saved last known counter: ${total} (${bottles} bottles + ${cans} cans)`);
    } else {
      await db.insert(machineStatus).values({
        machineId,
        status: 'operational',
        bottleCapacity: 100,
        canCapacity: 100,
        bottlesCount: 0,
        cansCount: 0,
        lastKnownCounter: total,
        lastKnownBottles: bottles,
        lastKnownCans: cans,
        lastApiSuccess: new Date(),
      });
      console.log(`[Database] ✅ Created machine status with counter: ${total}`);
    }
  } catch (error) {
    console.error("[Database] ❌ Failed to save last known counter:", error);
  }
}

export async function getLastKnownCounter(machineId: string): Promise<{ total: number; bottles: number; cans: number } | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get last known counter: database not available");
    return null;
  }

  try {
    const result = await db.select({
      total: machineStatus.lastKnownCounter,
      bottles: machineStatus.lastKnownBottles,
      cans: machineStatus.lastKnownCans,
    })
    .from(machineStatus)
    .where(eq(machineStatus.machineId, machineId))
    .limit(1);
    
    if (result.length > 0) {
      console.log(`[Database] ✅ Retrieved last known counter: ${result[0].total}`);
      return result[0];
    }
    
    console.log("[Database] ⚠️ No last known counter found");
    return null;
  } catch (error) {
    console.error("[Database] ❌ Failed to get last known counter:", error);
    return null;
  }
}

export async function updateMachineStatus(machineId: string, status: string, bottlesCount: number, cansCount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getMachineStatus(machineId);
  
  if (existing) {
    return await db.update(machineStatus)
      .set({
        status: status as any,
        bottlesCount,
        cansCount,
        lastUpdated: new Date(),
      })
      .where(eq(machineStatus.machineId, machineId));
  } else {
    return await db.insert(machineStatus).values({
      machineId,
      status: status as any,
      bottlesCount,
      cansCount,
    });
  }
}

// ============= Locations =============

export async function getLocations() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(locations);
}

export async function getLocationById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createLocation(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(locations).values(data);
}

// ============= Welfare Partners =============

export async function getWelfarePartners() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(welfarePartners);
}

export async function createWelfarePartner(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(welfarePartners).values(data);
}

import { asc } from "drizzle-orm";


// ============= Recycling Sessions (Gamification) =============

/**
 * Start a new recycling session
 * Records the current machine counter and user info
 */
export async function startRecyclingSession(data: {
  userName: string;
  userEmail?: string;
  userId?: number;
  machineId: string;
  startCount: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const session: InsertRecyclingSession = {
    userName: data.userName,
    userEmail: data.userEmail || null,
    userId: data.userId || null,
    machineId: data.machineId,
    startCount: data.startCount,
    status: "active",
  };

  const result = await db.insert(recyclingSessions).values(session);
  return result[0].insertId;
}

/**
 * Get any active session for a machine (to check if machine is busy)
 */
export async function getAnyActiveSession(machineId: string) {
  const db = await getDb();
  if (!db) return null;

  const sessions = await db
    .select()
    .from(recyclingSessions)
    .where(
      and(
        eq(recyclingSessions.machineId, machineId),
        eq(recyclingSessions.status, "active")
      )
    )
    .limit(1);

  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Get active session for a user
 */
export async function getActiveSession(userName: string, machineId: string) {
  const db = await getDb();
  if (!db) return null;

  const sessions = await db
    .select()
    .from(recyclingSessions)
    .where(
      and(
        eq(recyclingSessions.userName, userName),
        eq(recyclingSessions.machineId, machineId),
        eq(recyclingSessions.status, "active")
      )
    )
    .limit(1);

  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Update session activity timestamp
 */
export async function updateSessionActivity(sessionId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(recyclingSessions)
    .set({ lastActivity: new Date() })
    .where(eq(recyclingSessions.id, sessionId));
}

/**
 * Complete a recycling session
 * Calculates items recycled and updates leaderboard
 */
export async function completeRecyclingSession(
  sessionId: number,
  endCount: number,
  bottleCount: number,
  canCount: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const session = await db
    .select()
    .from(recyclingSessions)
    .where(eq(recyclingSessions.id, sessionId))
    .limit(1);

  if (session.length === 0) {
    throw new Error("Session not found");
  }

  const totalItems = endCount - session[0].startCount;

  await db
    .update(recyclingSessions)
    .set({
      endCount,
      bottleCount,
      canCount,
      totalItems,
      status: "completed",
      endTime: new Date(),
    })
    .where(eq(recyclingSessions.id, sessionId));

  // Add to recycling contributions if user has items
  if (totalItems > 0 && session[0].userId) {
    await db.insert(recyclingContributions).values({
      userId: session[0].userId,
      bottleCount,
      canCount,
      totalWeight: 0, // TODO: Calculate based on item types
      earnedAmount: 0, // TODO: Calculate based on deposit values
    });
  }

  return totalItems;
}

/**
 * Timeout inactive sessions
 * Called by cron job to auto-close sessions with no activity for 40+ seconds
 */
export async function timeoutInactiveSessions(timeoutSeconds: number = 40) {
  const db = await getDb();
  if (!db) return 0;

  const cutoffTime = new Date(Date.now() - timeoutSeconds * 1000);

  const result = await db
    .update(recyclingSessions)
    .set({
      status: "timeout",
      endTime: new Date(),
    })
    .where(
      and(
        eq(recyclingSessions.status, "active"),
        // @ts-ignore - drizzle type issue with timestamp comparison
        gte(cutoffTime, recyclingSessions.lastActivity)
      )
    );

  return result[0].affectedRows || 0;
}

/**
 * Get recent completed sessions for leaderboard
 */
export async function getRecentSessions(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(recyclingSessions)
    .where(eq(recyclingSessions.status, "completed"))
    .orderBy(desc(recyclingSessions.createdAt))
    .limit(limit);
}

/**
 * Get top recycling sessions for leaderboard
 * @param period "week" for current week, "alltime" for all-time best
 * @param limit Number of sessions to return (default 10)
 * @returns Top sessions sorted by totalItems descending
 */
export async function getTopSessions(period: "week" | "alltime", limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  // Build where conditions
  const conditions = [eq(recyclingSessions.status, "completed")];
  
  if (period === "week") {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    
    // @ts-ignore - drizzle type issue with timestamp comparison
    conditions.push(gte(recyclingSessions.startTime, monday));
  }

  const sessions = await db
    .select({
      userName: recyclingSessions.userName,
      totalItems: recyclingSessions.totalItems,
      bottleCount: recyclingSessions.bottleCount,
      canCount: recyclingSessions.canCount,
      startTime: recyclingSessions.startTime,
      endTime: recyclingSessions.endTime,
    })
    .from(recyclingSessions)
    .where(and(...conditions))
    .orderBy(desc(recyclingSessions.totalItems))
    .limit(limit);

  return sessions.map((session, index) => ({
    rank: index + 1,
    displayName: session.userName || "Scooterpoint",
    depositCount: session.totalItems || 0,
    bottleCount: session.bottleCount || 0,
    canCount: session.canCount || 0,
    timestamp: session.endTime || session.startTime,
  }));
}


// ============================================
// DROP MANAGEMENT FUNCTIONS (Claim-based system)
// ============================================

/**
 * Create a new drop when counter increases
 */
export async function createDrop(data: {
  machineId: string;
  previousCount: number;
  newCount: number;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const itemsAdded = data.newCount - data.previousCount;
  const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds from now

  const result = await db.insert(drops).values({
    machineId: data.machineId,
    previousCount: data.previousCount,
    newCount: data.newCount,
    itemsAdded,
    expiresAt,
    status: "pending",
    claimedBy: "Scooterpoint", // Default
  });

  return result[0].insertId;
}

/**
 * Get pending drop for a machine (if any)
 */
export async function getPendingDrop(machineId: string): Promise<Drop | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(drops)
    .where(and(eq(drops.machineId, machineId), eq(drops.status, "pending")))
    .orderBy(desc(drops.detectedAt))
    .limit(1);

  return result[0];
}

/**
 * Get the last drop for a machine (any status)
 */
export async function getLastDrop(machineId: string): Promise<Drop | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(drops)
    .where(eq(drops.machineId, machineId))
    .orderBy(desc(drops.detectedAt))
    .limit(1);

  return result[0];
}

/**
 * Claim a drop by name
 */
export async function claimDrop(dropId: number, claimedBy: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Check if drop is still pending and not expired
  const drop = await db.select().from(drops).where(eq(drops.id, dropId)).limit(1);
  if (!drop[0] || drop[0].status !== "pending") return false;
  if (new Date() > new Date(drop[0].expiresAt)) {
    // Expired, mark as expired
    await db.update(drops).set({ status: "expired" }).where(eq(drops.id, dropId));
    return false;
  }

  // Claim the drop
  await db.update(drops).set({
    claimedBy,
    claimedAt: new Date(),
    status: "claimed",
  }).where(eq(drops.id, dropId));

  return true;
}

/**
 * Expire unclaimed drops (called periodically)
 */
export async function expireOldDrops(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const now = new Date();
  
  const result = await db
    .update(drops)
    .set({ status: "expired" })
    .where(and(
      eq(drops.status, "pending"),
      // @ts-ignore - drizzle type issue with timestamp comparison
      gte(now, drops.expiresAt)
    ));

  return result[0].affectedRows || 0;
}

/**
 * Get leaderboard from drops (replaces session-based leaderboard)
 */
export async function getDropLeaderboard(period: "week" | "alltime", limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  // Build where conditions - only count claimed or expired drops
  const conditions = [
    // Status must be claimed or expired (both count towards leaderboard)
  ];
  
  if (period === "week") {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    
    // @ts-ignore - drizzle type issue with timestamp comparison
    conditions.push(gte(drops.detectedAt, monday));
  }

  // Group by claimedBy and sum itemsAdded
  const result = await db
    .select({
      claimedBy: drops.claimedBy,
      totalItems: drops.itemsAdded,
    })
    .from(drops)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(drops.itemsAdded));

  // Aggregate by claimedBy
  const aggregated = new Map<string, number>();
  for (const row of result) {
    const current = aggregated.get(row.claimedBy) || 0;
    aggregated.set(row.claimedBy, current + (row.totalItems || 0));
  }

  // Convert to array and sort
  const leaderboard = Array.from(aggregated.entries())
    .map(([name, count]) => ({
      displayName: name,
      depositCount: count,
    }))
    .sort((a, b) => b.depositCount - a.depositCount)
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

  return leaderboard;
}


// ============================================
// A/B TEST FUNCTIONS
// ============================================

/**
 * Track an A/B test event (impression, conversion, dismiss)
 */
export async function trackAbTestEvent(data: {
  testName: string;
  variantKey: string;
  visitorId: string;
  eventType: 'impression' | 'conversion' | 'dismiss';
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[A/B Test] Cannot track event: database not available");
    return;
  }

  await db.insert(abTestEvents).values({
    testName: data.testName,
    variantKey: data.variantKey,
    visitorId: data.visitorId,
    eventType: data.eventType,
  });
}

/**
 * Get A/B test results for a specific test
 */
export async function getAbTestResults(testName: string) {
  const db = await getDb();
  if (!db) return null;

  // Get all events for this test
  const events = await db
    .select()
    .from(abTestEvents)
    .where(eq(abTestEvents.testName, testName));

  // Aggregate by variant
  const results: Record<string, {
    impressions: number;
    conversions: number;
    dismissals: number;
    uniqueVisitors: Set<string>;
    conversionRate: number;
  }> = {
    A: { impressions: 0, conversions: 0, dismissals: 0, uniqueVisitors: new Set(), conversionRate: 0 },
    B: { impressions: 0, conversions: 0, dismissals: 0, uniqueVisitors: new Set(), conversionRate: 0 },
  };

  for (const event of events) {
    const variant = event.variantKey as 'A' | 'B';
    if (!results[variant]) continue;

    results[variant].uniqueVisitors.add(event.visitorId);

    switch (event.eventType) {
      case 'impression':
        results[variant].impressions++;
        break;
      case 'conversion':
        results[variant].conversions++;
        break;
      case 'dismiss':
        results[variant].dismissals++;
        break;
    }
  }

  // Calculate conversion rates
  for (const variant of ['A', 'B'] as const) {
    const total = results[variant].impressions;
    if (total > 0) {
      results[variant].conversionRate = (results[variant].conversions / total) * 100;
    }
  }

  return {
    testName,
    variantA: {
      impressions: results.A.impressions,
      conversions: results.A.conversions,
      dismissals: results.A.dismissals,
      uniqueVisitors: results.A.uniqueVisitors.size,
      conversionRate: results.A.conversionRate,
    },
    variantB: {
      impressions: results.B.impressions,
      conversions: results.B.conversions,
      dismissals: results.B.dismissals,
      uniqueVisitors: results.B.uniqueVisitors.size,
      conversionRate: results.B.conversionRate,
    },
    winner: results.A.conversionRate > results.B.conversionRate ? 'A' : 
            results.B.conversionRate > results.A.conversionRate ? 'B' : 'tie',
    totalEvents: events.length,
  };
}

/**
 * Get all A/B test names
 */
export async function getAbTestNames(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  const events = await db
    .select({ testName: abTestEvents.testName })
    .from(abTestEvents);

  const uniqueNames = new Set(events.map(e => e.testName));
  return Array.from(uniqueNames);
}

/**
 * Clear A/B test data for a specific test (for resetting)
 */
export async function clearAbTestData(testName: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(abTestEvents).where(eq(abTestEvents.testName, testName));
}

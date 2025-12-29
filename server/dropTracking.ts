import { eq, lt, and } from "drizzle-orm";
import { getDb } from "./db";
import { pendingDrop, dropsHistory, type InsertPendingDrop, type InsertDropsHistory } from "../drizzle/schema";
import { validateName } from "./nameFilter";

const MACHINE_ID = "090373";
const QUEUE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if queue slot is available (no pending drop or expired)
 */
export async function isQueueAvailable(): Promise<{ available: boolean }> {
  const db = await getDb();
  if (!db) return { available: false };

  // Clean up expired entries first
  await db.delete(pendingDrop).where(lt(pendingDrop.expiresAt, new Date()));

  // Check if any active pending drop exists
  const existing = await db
    .select()
    .from(pendingDrop)
    .where(eq(pendingDrop.machineId, MACHINE_ID))
    .limit(1);

  return { available: existing.length === 0 };
}

/**
 * Add name to queue (single slot)
 * Returns success status and message
 */
export async function addToQueue(name: string): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  if (!db) return { success: false, message: "Database niet beschikbaar" };

  // Validate name for profanity using AI
  const validation = await validateName(name);
  if (!validation.isAllowed) {
    return { success: false, message: validation.reason || "Ongeldige naam" };
  }

  // Check if slot is available
  const { available } = await isQueueAvailable();
  if (!available) {
    return { success: false, message: "Iemand is al bezig, wacht even..." };
  }

  // Add to queue
  const expiresAt = new Date(Date.now() + QUEUE_TIMEOUT_MS);
  await db.insert(pendingDrop).values({
    name,
    machineId: MACHINE_ID,
    expiresAt,
  });

  console.log(`[DropTracking] ✅ ${name} toegevoegd aan wachtrij (verloopt om ${expiresAt.toLocaleTimeString()})`);
  return { success: true, message: `${name} wacht op drop...` };
}

/**
 * Get current pending drop (if any)
 */
export async function getPendingDrop() {
  const db = await getDb();
  if (!db) return null;

  // Clean up expired first
  await db.delete(pendingDrop).where(lt(pendingDrop.expiresAt, new Date()));

  const result = await db
    .select()
    .from(pendingDrop)
    .where(eq(pendingDrop.machineId, MACHINE_ID))
    .limit(1);

  return result[0] || null;
}

/**
 * Assign counter increase to pending drop
 * Called by counter spy when increase is detected
 */
export async function assignDropToQueue(
  previousCounter: number,
  newCounter: number
): Promise<{ assigned: boolean; name?: string; items?: number }> {
  const db = await getDb();
  if (!db) return { assigned: false };

  const pending = await getPendingDrop();
  if (!pending) {
    console.log("[DropTracking] ⚠️ Counter stijging gedetecteerd maar geen wachtende naam");
    return { assigned: false };
  }

  const itemsCount = newCounter - previousCounter;

  // Save to history
  await db.insert(dropsHistory).values({
    name: pending.name,
    machineId: MACHINE_ID,
    itemsCount,
    previousCounter,
    newCounter,
  });

  // Remove from queue
  await db.delete(pendingDrop).where(eq(pendingDrop.id, pending.id));

  console.log(`[DropTracking] 🎉 ${pending.name} heeft ${itemsCount} items ingeleverd!`);

  return {
    assigned: true,
    name: pending.name,
    items: itemsCount,
  };
}

/**
 * Get drops history (for leaderboard)
 */
export async function getDropsHistory(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(dropsHistory)
    .where(eq(dropsHistory.machineId, MACHINE_ID))
    .orderBy(dropsHistory.assignedAt)
    .limit(limit);

  return result;
}

/**
 * Cancel pending drop (if user wants to cancel)
 */
export async function cancelPendingDrop(name: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .delete(pendingDrop)
    .where(and(eq(pendingDrop.name, name), eq(pendingDrop.machineId, MACHINE_ID)));

  console.log(`[DropTracking] ❌ ${name} geannuleerd`);
  return true;
}

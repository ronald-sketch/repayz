import { getDb } from "./db";
import { pendingDrop, dropsHistory } from "../drizzle/schema";
import { eq, and, gt } from "drizzle-orm";

/**
 * ePortal Webhook Event Types
 * Event 40010 = Receipt data pushed
 */

interface ReceiptCategory {
  DepCat: number;
  Cnt: number;
}

interface ReceiptBarcode {
  Barcode: string;
  DepCat: number;
  Cnt: number;
}

interface ReceiptData {
  Date: string;
  Deposit: number;
  TotalCnt: number;
  Coupon: string;
  CustomerId: string;
  ReceiptId: number;
  Barcode: number;
  Cats: ReceiptCategory[];
  Barcodes: ReceiptBarcode[];
}

interface WebhookEvent {
  siteId: string;
  rvmId: string;
  eventId: number;
  event: string;
  time: string;
  eventData?: {
    Receipt?: ReceiptData;
  };
}

interface WebhookPayload {
  events: WebhookEvent[];
  customData?: string;
}

interface ProcessResult {
  success: boolean;
  matchedSession?: {
    name: string;
    itemCount: number;
  };
  error?: string;
}

/**
 * Process incoming webhook from ePortal
 * Matches receipt data to active pending drops (15-min sessions)
 */
export async function processEportalWebhook(payload: WebhookPayload): Promise<ProcessResult[]> {
  const results: ProcessResult[] = [];

  for (const event of payload.events) {
    // Only process receipt events (40010)
    if (event.eventId !== 40010) {
      console.log(`[Webhook] Skipping event ${event.eventId}: ${event.event}`);
      continue;
    }

    const receipt = event.eventData?.Receipt;
    if (!receipt) {
      console.warn(`[Webhook] Event 40010 missing receipt data`);
      results.push({ success: false, error: "Missing receipt data" });
      continue;
    }

    console.log(`[Webhook] Processing receipt: ${receipt.TotalCnt} items, ReceiptId: ${receipt.ReceiptId}`);

    try {
      // Find active pending drop (within 15 min window)
      const now = new Date();
      const db = await getDb();
      if (!db) {
        results.push({ success: false, error: "Database not available" });
        continue;
      }

      const activeDrop = await db
        .select()
        .from(pendingDrop)
        .where(
          and(
            eq(pendingDrop.machineId, event.rvmId),
            gt(pendingDrop.expiresAt, now)
          )
        )
        .limit(1);

      if (activeDrop.length > 0) {
        const drop = activeDrop[0];
        
        // Match found! Assign receipt to this user
        console.log(`[Webhook] Matched receipt to user: ${drop.name}`);

        // Save to drops history
        await db.insert(dropsHistory).values({
          name: drop.name,
          machineId: event.rvmId,
          itemsCount: receipt.TotalCnt,
          previousCounter: 0, // Not tracking counter in webhook flow
          newCounter: receipt.TotalCnt,
          assignedAt: new Date(),
        });

        // Remove the pending drop (session completed)
        await db.delete(pendingDrop).where(eq(pendingDrop.id, drop.id));

        results.push({
          success: true,
          matchedSession: {
            name: drop.name,
            itemCount: receipt.TotalCnt,
          },
        });
      } else {
        // No active session - assign to default (Scooterpoint)
        console.log(`[Webhook] No active session, assigning to Scooterpoint`);

        await db.insert(dropsHistory).values({
          name: "Scooterpoint",
          machineId: event.rvmId,
          itemsCount: receipt.TotalCnt,
          previousCounter: 0,
          newCounter: receipt.TotalCnt,
          assignedAt: new Date(),
        });

        results.push({
          success: true,
          matchedSession: {
            name: "Scooterpoint",
            itemCount: receipt.TotalCnt,
          },
        });
      }
    } catch (error) {
      console.error(`[Webhook] Error processing receipt:`, error);
      results.push({ success: false, error: String(error) });
    }
  }

  return results;
}

/**
 * Verify webhook authenticity (basic auth check)
 * ePortal sends credentials in Authorization header
 */
export function verifyWebhookAuth(authHeader: string | undefined, expectedUsername: string, expectedPassword: string): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  return username === expectedUsername && password === expectedPassword;
}

/**
 * Machine Router
 * 
 * Handles all machine-related endpoints including:
 * - Machine status and data from backbone service
 * - Admin operations (force refresh, events)
 * - Total collected statistics
 */

import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import * as machineBackbone from "../machineBackbone";

// Default fallback values when backbone has no data
const DEFAULT_MACHINE_DATA = {
  total: 1869,
  bottles: 1200,
  cans: 669,
  todayTotal: 0,
};

export const machineRouter = router({
  // Get backbone service status (admin only)
  getBackboneStatus: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized - Admin only");
      }
      return machineBackbone.getBackboneStatus();
    }),

  // Force refresh machine data (admin only)
  forceRefresh: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized - Admin only");
      }
      const machineSerial = process.env.EPORTAL_MACHINE_SERIAL || '090373';
      const data = await machineBackbone.refreshMachineData(machineSerial);
      return { success: true, data };
    }),

  // Get cached machine data (fast, from backbone)
  getCachedData: publicProcedure
    .input(z.object({
      machineId: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const machineId = input?.machineId || process.env.EPORTAL_MACHINE_SERIAL || '090373';
      return machineBackbone.getMachineData(machineId);
    }),

  // Get all machines data
  getAllMachines: publicProcedure
    .query(async () => {
      return machineBackbone.getAllMachinesData();
    }),

  // Get recent events from ePortal (admin only)
  getRecentEvents: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized - Admin only");
      }
      const machineSerial = process.env.EPORTAL_MACHINE_SERIAL || '090373';
      const events = await machineBackbone.fetchRecentEvents(machineSerial);
      return {
        events,
        activeEventIds: machineBackbone.getActiveEventIds(),
        lastFetch: new Date().toISOString()
      };
    }),

  // Get active event IDs for highlighting (admin only)
  getActiveEventIds: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized - Admin only");
      }
      return machineBackbone.getActiveEventIds();
    }),

  // Get total collected - ONLY from backbone
  getTotalCollected: publicProcedure
    .query(async () => {
      const machineSerial = process.env.EPORTAL_MACHINE_SERIAL || '090373';
      const cached = machineBackbone.getMachineData(machineSerial);
      
      if (cached) {
        return {
          // All-time total (lifetime meter)
          total: cached.allTimeTotal,
          // Today's counts
          todayTotal: cached.todayTotal,
          todayBottles: cached.todayBottles,
          todayCans: cached.todayCans,
          // Bin fill counts (for reference)
          binBottles: cached.binBottles,
          binCans: cached.binCans,
          // Raw data for debugging
          rawData: cached.rawData,
        };
      }
      
      // Return default fallback values when backbone has no data
      console.log('[Machine] No backbone data available, using defaults');
      return DEFAULT_MACHINE_DATA;
    }),

  // Get machine status - ONLY from backbone
  getStatus: publicProcedure
    .input(z.object({
      machineId: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const machineSerial = input?.machineId || process.env.EPORTAL_MACHINE_SERIAL || '090373';
      const cached = machineBackbone.getMachineData(machineSerial);
      
      if (cached) {
        return {
          machineId: machineSerial,
          status: cached.status,
          statusType: (() => {
            switch (cached.status) {
              case 'operational': return 'ready' as const;
              case 'error': return 'error' as const;
              case 'door_open': return 'door_open' as const;
              case 'maintenance': return 'service' as const;
              case 'full': return 'full' as const;
              default: return 'offline' as const;
            }
          })(),
          // Today's counts (reset at midnight)
          todayBottles: cached.todayBottles,
          todayCans: cached.todayCans,
          todayTotal: cached.todayTotal,
          // All-time total (lifetime meter)
          allTimeTotal: cached.allTimeTotal,
          // All-time split (calculated from baseline + accumulated)
          allTimeBottles: cached.allTimeBottles,
          allTimeCans: cached.allTimeCans,
          // Bin fill counts (for reference)
          binBottles: cached.binBottles,
          binCans: cached.binCans,
          lastUpdated: cached.lastUpdated,
          apiStatus: cached.apiStatus,
        };
      }
      
      // Return default fallback when backbone has no data
      console.log('[Machine] No backbone data available, using defaults');
      return {
        machineId: machineSerial,
        status: 'operational' as const,
        statusType: 'ready' as const,
        todayBottles: 0,
        todayCans: 0,
        todayTotal: DEFAULT_MACHINE_DATA.todayTotal,
        allTimeTotal: DEFAULT_MACHINE_DATA.total,
        allTimeBottles: 2504, // Baseline PET bottles
        allTimeCans: 7519,    // Baseline cans
        binBottles: 0,
        binCans: 0,
        lastUpdated: new Date(),
        apiStatus: 'offline' as const,
      };
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      machineId: z.string(),
      status: z.enum(["operational", "maintenance", "offline", "full"]),
      bottlesCount: z.number().int().min(0),
      cansCount: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      // Only admins can update machine status
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await db.updateMachineStatus(
        input.machineId,
        input.status,
        input.bottlesCount,
        input.cansCount
      );

      return { success: true };
    }),
});

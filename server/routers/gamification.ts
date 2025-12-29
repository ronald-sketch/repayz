/**
 * Gamification Router
 * 
 * Handles all gamification-related endpoints including:
 * - Drop tracking (15-minute sessions)
 * - Leaderboard
 * - Recycling contributions
 */

import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import * as dropTracking from "../dropTracking";

export const gamificationRouter = router({
  // ============= Leaderboard =============
  leaderboard: router({
    getTopSessions: publicProcedure
      .input(z.object({
        period: z.enum(["week", "alltime"]),
        limit: z.number().int().min(1).max(50).default(10),
      }))
      .query(async ({ input }) => {
        return await db.getTopSessions(input.period, input.limit);
      }),
  }),

  // ============= Recycling Contributions =============
  recycling: router({
    addContribution: protectedProcedure
      .input(z.object({
        bottleCount: z.number().int().min(0),
        canCount: z.number().int().min(0),
        weight: z.number().int().min(0),
        earnedAmount: z.number().int().min(0),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new Error("User not authenticated");
        
        await db.addRecyclingContribution(
          ctx.user.id,
          input.bottleCount,
          input.canCount,
          input.weight,
          input.earnedAmount
        );

        return { success: true };
      }),

    getUserContributions: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) throw new Error("User not authenticated");
        return await db.getUserContributions(ctx.user.id);
      }),

    getStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user?.id) throw new Error("User not authenticated");
        
        const contributions = await db.getUserContributions(ctx.user.id);
        const totalBottles = contributions.reduce((sum, c) => sum + c.bottleCount, 0);
        const totalCans = contributions.reduce((sum, c) => sum + c.canCount, 0);
        const totalWeight = contributions.reduce((sum, c) => sum + c.totalWeight, 0);
        const totalEarned = contributions.reduce((sum, c) => sum + c.earnedAmount, 0);

        return {
          totalBottles,
          totalCans,
          totalWeight,
          totalEarned,
          contributionCount: contributions.length,
        };
      }),
  }),

  // ============= Drop Tracking (15-minute sessions) =============
  drop: router({
    isQueueAvailable: publicProcedure
      .query(async () => {
        return await dropTracking.isQueueAvailable();
      }),

    addToQueue: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
      }))
      .mutation(async ({ input }) => {
        return await dropTracking.addToQueue(input.name);
      }),

    getPendingDrop: publicProcedure
      .query(async () => {
        return await dropTracking.getPendingDrop();
      }),

    getDropsHistory: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(10),
      }))
      .query(async ({ input }) => {
        return await dropTracking.getDropsHistory(input.limit);
      }),

    cancelPendingDrop: publicProcedure
      .input(z.object({
        name: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await dropTracking.cancelPendingDrop(input.name);
      }),
  }),
});

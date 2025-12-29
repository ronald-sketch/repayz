/**
 * Admin Router
 * 
 * Handles all admin-related endpoints including:
 * - A/B Testing management
 * - Welfare partners management
 */

import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";

export const adminRouter = router({
  // ============= A/B Testing =============
  abTest: router({
    trackEvent: publicProcedure
      .input(z.object({
        testName: z.string(),
        variantKey: z.string(),
        visitorId: z.string(),
        eventType: z.enum(['impression', 'conversion', 'dismiss']),
      }))
      .mutation(async ({ input }) => {
        await db.trackAbTestEvent(input);
        return { success: true };
      }),

    getResults: protectedProcedure
      .input(z.object({
        testName: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        // Only admins can view A/B test results
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return await db.getAbTestResults(input.testName);
      }),

    getAllTests: protectedProcedure
      .query(async ({ ctx }) => {
        // Only admins can view A/B test list
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return await db.getAbTestNames();
      }),

    clearTest: protectedProcedure
      .input(z.object({
        testName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Only admins can clear A/B test data
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await db.clearAbTestData(input.testName);
        return { success: true };
      }),
  }),

  // ============= Welfare Partners =============
  welfare: router({
    list: publicProcedure
      .query(async () => {
        return await db.getWelfarePartners();
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        address: z.string().optional(),
        website: z.string().optional(),
        logo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await db.createWelfarePartner(input);
        return { success: true };
      }),
  }),
});

/**
 * Locations Router
 * 
 * Handles all location-related endpoints including:
 * - List all locations
 * - Get location by ID
 * - Create new locations (admin only)
 */

import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";

export const locationsRouter = router({
  list: publicProcedure
    .query(async () => {
      return await db.getLocations();
    }),

  getById: publicProcedure
    .input(z.object({
      id: z.number().int(),
    }))
    .query(async ({ input }) => {
      return await db.getLocationById(input.id);
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      address: z.string(),
      city: z.string(),
      country: z.string(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      openingHours: z.string(),
      machineId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await db.createLocation(input);
      return { success: true };
    }),
});

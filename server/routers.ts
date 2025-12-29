/**
 * Main App Router
 * 
 * Combines all feature routers into a single appRouter.
 * Each feature is split into its own file for better maintainability:
 * 
 * - routers/machine.ts     - Machine status, backbone, events
 * - routers/gamification.ts - Leaderboard, recycling, drop tracking
 * - routers/admin.ts       - A/B testing, welfare partners
 * - routers/locations.ts   - Location management
 * - routers/wally.ts       - Wally AI chatbot
 */

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// Import feature routers
import {
  machineRouter,
  gamificationRouter,
  adminRouter,
  locationsRouter,
  wallyRouter,
} from "./routers/index";

export const appRouter = router({
  // System router (notifications, health checks)
  system: systemRouter,

  // Authentication
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Feature routers
  machine: machineRouter,
  locations: locationsRouter,
  wally: wallyRouter,

  // Gamification features (nested structure preserved for API compatibility)
  leaderboard: gamificationRouter.leaderboard,
  recycling: gamificationRouter.recycling,
  drop: gamificationRouter.drop,
  dropTracking: gamificationRouter.drop, // Alias for backwards compatibility

  // Admin features
  abTest: adminRouter.abTest,
  welfare: adminRouter.welfare,
});

export type AppRouter = typeof appRouter;

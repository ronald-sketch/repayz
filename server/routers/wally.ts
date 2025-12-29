/**
 * Wally Router
 * 
 * Handles all Wally AI chatbot endpoints
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { chatWithWally } from "../wallyChat";

export const wallyRouter = router({
  chat: publicProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })),
      language: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await chatWithWally(input);
    }),
});

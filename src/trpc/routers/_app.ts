import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { eq } from 'drizzle-orm';
import { user, workflow } from '@/drizzle/schema';
import { db } from '@/drizzle';

import { openai } from '@ai-sdk/openai';
import { model } from '@/lib/ai';
import { inngest } from '@/inngest/client';
import { TRPCBuilder, TRPCError } from '@trpc/server';

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async ({ ctx }) => {
    // throw new TRPCError({ code: "BAD_REQUEST", message: "something went wrong" })

    await inngest.send({ name: 'go/ai' })
    return { success: true, message: 'Job Queued' }
  }),

  workflow: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(workflow).limit(75)
  }),
  createWorkFlow: protectedProcedure.mutation(() => {
    return db.insert(workflow).values({ name: "create workflow" })
  }),
  deleteDB: protectedProcedure.mutation(async () => {
    return db.delete(workflow)
  })
});


export type AppRouter = typeof appRouter;
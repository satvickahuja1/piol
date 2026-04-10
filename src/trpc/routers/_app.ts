import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { eq } from 'drizzle-orm';
import { user } from '@/drizzle/schema';
import { db } from '@/drizzle';


export const appRouter = createTRPCRouter({
  lover: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(user).where(eq(user.id, ctx.auth.user.id))
  })
});


export type AppRouter = typeof appRouter;
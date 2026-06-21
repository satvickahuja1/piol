import { auth } from "@/lib/auth";
import { createTRPCRouter, protectedProcedure } from "../init";
import { polarClient } from "@/lib/polar";
import { TRPCError } from "@trpc/server";
import { workflowRouter } from "@/features/workflow/server/router";
import { inngest } from "@/inngest/client";
import z from "zod";
import { db } from "@/drizzle";
import { workflow } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const appRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const workflow1 = await db
        .select()
        .from(workflow)
        .where(
          and(eq(workflow.id, input.id), eq(workflow.userId, ctx.auth.user.id)),
        );
      await inngest.send({
        name: "workflows/execute",
        data: { workflowId: input.id },
      });
      return workflow1;
    }),
  checkSubs: protectedProcedure.query(async ({ ctx }) => {
    const res = await polarClient.customers.getStateExternal({
      externalId: ctx.auth?.user.id,
    });

    const activeSub = res.activeSubscriptions[0];

    if (!activeSub) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "not subscribed",
      });
    }
    return activeSub;
  }),
  workflow: workflowRouter,
});

export type AppRouter = typeof appRouter;

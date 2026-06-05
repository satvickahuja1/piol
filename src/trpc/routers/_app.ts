import { auth } from "@/lib/auth";
import { createTRPCRouter, protectedProcedure } from "../init";
import { polarClient } from "@/lib/polar";
import { TRPCError } from "@trpc/server";
import { workflowRouter } from "@/features/workflow/server/router";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
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

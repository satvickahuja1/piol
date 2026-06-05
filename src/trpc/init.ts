import { db } from "@/drizzle";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";


export const createTRPCContext = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return { db, auth: session };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer : superjson
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "unauthorized user is takingg command",
    });
  }
  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.auth) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "not allowed for services",
      });
    }
    const res = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    if (!res.activeSubscriptions || res.activeSubscriptions.length === 0) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "not subscribed to services",
      });
    }
    return next({ ctx: { ...ctx, isSubscribed: true } });
  },
);

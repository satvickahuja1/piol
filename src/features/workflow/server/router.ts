import { PAGINATION } from "@/config/pagination";
import { db } from "@/drizzle";
import { user, workflow } from "@/drizzle/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { z } from "zod";

// You can switch to premiumProcedure if needed
export const workflowRouter = createTRPCRouter({
  getOne: premiumProcedure
    .input(
      z.object({
        id: z.string(),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id, page, pageSize, search } = input;
      return await db
        .select()
        .from(workflow)
        .where(and(eq(workflow.userId, ctx.auth.user.id), eq(workflow.id, id)));
    }),
  getMany: premiumProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const offset = (page - 1) * pageSize;
      const [item, totalCount] = await Promise.all([
        db
          .select()
          .from(workflow)
          .where(
            and(
              eq(workflow.userId, ctx.auth.user.id),
              ilike(workflow.name, `%${search}%`),
            ),
          )
          .limit(pageSize)
          .offset(offset)
          .orderBy(desc(workflow.name)),
        db
          .select({ count: count() })
          .from(workflow)
          .where(
            and(
              eq(workflow.userId, ctx.auth.user.id),
              ilike(workflow.name, `%${search}%`),
            ),
          ),
      ]);
      const totalPages = Math.ceil(totalCount[0]?.count / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      return {
        item,
        totalPages,
        hasNextPage,
        hasPrevPage,
        totalCount,
        page,
        pageSize,
        search,
      };
    }),
  create: premiumProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db
        .insert(workflow)
        .values({ name: input.name, userId: ctx.auth.user.id })
        .returning();
    }),
  update: premiumProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db
        .update(workflow)
        .set({ name: input.name })
        .where(
          and(eq(workflow.userId, ctx.auth.user.id), eq(workflow.id, input.id)),
        )
        .returning();
    }),
  delete: premiumProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db
        .delete(workflow)
        .where(
          and(eq(workflow.userId, ctx.auth.user.id), eq(workflow.id, input.id)),
        )
        .returning();
    }),
});

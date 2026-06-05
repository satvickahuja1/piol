import { PAGINATION } from "@/config/pagination";
import { db } from "@/drizzle";
import { generateSlug } from "random-word-slugs";
import { connection, nodes, NodeType, user, workflow } from "@/drizzle/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { Edge, Node } from "@xyflow/react";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { includes, z } from "zod";
import { TRPCError } from "@trpc/server";

// You can switch to premiumProcedure if needed
export const workflowRouter = createTRPCRouter({
  getOne: premiumProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const workflowg = await db.query.workflow.findFirst({
        where: and(eq(workflow.id, id), eq(workflow.userId, ctx.auth.user.id)),
        with: {
          node: true,
          connection: true,
        },
      });
      const nodes : Node[] = (workflowg?.node ?? []).map((node) => ({
        id: node.id,
        type: node.type || "",
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) ?? {},
      }));
      const edges: Edge[] = (workflowg?.connection ?? [])
        .filter((con) => con.fromnodeId && con.tonodeId)
        .map((con) => ({
          id: con.id,
          source: con.fromnodeId!,
          target: con.tonodeId!,
          sourceHandle: con.fromOutput,
          targetHandle: con.toInput,
        }));
      return {
        id: workflowg?.id,
        name: workflowg?.name,
        nodes,
        edges,
      };
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
      const res = generateSlug(5);
      await db.transaction(async (tx) => {
        const [createdWorkflow] = await tx
          .insert(workflow)
          .values({ name: res, userId: ctx.auth.user.id })
          .returning();
        const node1 = await tx
          .insert(nodes)
          .values({
            type: NodeType.INITIAL,
            workflowId: createdWorkflow.id,
            position: {
              x: 200,
              y: 0,
            },
            name: "sajanva",
          })
          .returning();

        return createdWorkflow;
      });
    }),
  updateName: premiumProcedure
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
  update: premiumProcedure
    .input(
      z.object({
        id: z.string(),
        node: z.array(
          z.object({
            id: z.string(),
            position: z.object({ x: z.number(), y: z.number() }),
            type:  z.string().nullish(),
            data: z.record(z.string(), z.any()),
          }),
        ),
        edges: z.array(
          z.object({
            id: z.string(),
            source: z.string().nullable(),
            target: z.string().nullable(),
            sourceHandle: z.string(),
            targetHandle: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, node, edges } = input;
      const workflows = await db
        .select()
        .from(workflow)
        .where(and(eq(workflow.userId, ctx.auth.user.id), eq(workflow.id, id)));
      if (workflows.length===0) {
        throw new TRPCError({
          message: "workflow not found",
          code: "NOT_FOUND",
        });
      }
      return await db.transaction(async (tx) => {
        await tx.delete(nodes).where(eq(nodes.workflowId, id));
        await Promise.all(
          node.map(async (res) => {
             await tx.insert(nodes).values({
              id: res.id,
              position: res.position,
              data: res.data || {},
              name: res.type || "unknown",
              type: res.type as unknown as NodeType,
              workflowId: id,
            });
          }),
        );
        await Promise.all(
          edges.map(async (res) => {
            await tx.insert(connection).values({
              workflowId: id,
              toInput: res.targetHandle,
              fromOutput: res.sourceHandle,
              tonodeId: res.target,
              fromnodeId: res.source,
            });
          }),
        );
        await tx
          .update(workflow)
          .set({ updatedAt: new Date() })
          .where(eq(workflow.id, id));
      });
    }),
  delete: premiumProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db
        .delete(workflow)
        .where(
          and(eq(workflow.userId, ctx.auth.user.id), eq(workflow.id, input.id)),
        )
        .returning();
    }),
});

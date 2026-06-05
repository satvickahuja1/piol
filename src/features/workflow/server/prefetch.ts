import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflow.getMany>;
type InputId = inferInput<typeof trpc.workflow.getOne>;

export const prefetchWorkflow = async (params: Input) => {
  return prefetch(trpc.workflow.getMany.queryOptions(params));
};
export const prefetchWorkflowById = async ({ id }: InputId) => {
  return prefetch(trpc.workflow.getOne.queryOptions({ id }));
};

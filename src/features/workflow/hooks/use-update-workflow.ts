"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflow.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow  saved`);
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
        queryClient.invalidateQueries(trpc.workflow.getOne.queryOptions({}));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { WorkflowList } from "../components/workflow";
import { useWorkflowsParams } from "./use-workflow-params";
import { toast } from "sonner";

const getWorkflowList = () => {
  const [params, setParams] = useWorkflowsParams();
  const trpc = useTRPC();
  const res = useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
  return res.data;
};

const useCreateWorkflow = () => {
  const [params] = useWorkflowsParams();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: (d) => {
        toast.success(`Workflow "${d[0].name}" created`);
        queryClient.invalidateQueries(
            trpc.workflow.getMany.queryOptions(params)
        )
      },
    }),
  );
};

const useSuspenseWorkflow = ()=>{
  const trpc = useTRPC()
  const [params] = useWorkflowsParams()
  return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params))
}
export { getWorkflowList ,useCreateWorkflow , useSuspenseWorkflow};

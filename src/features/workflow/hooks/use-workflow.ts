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
import { useRouter } from "next/navigation";
import { workflowParams } from "../server/param";

const getWorkflowList = () => {
  const [params, setParams] = useWorkflowsParams();
  const trpc = useTRPC();
  const res = useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));

  return res;
};

const useCreateWorkflow = () => {
  const [params] = useWorkflowsParams();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();
  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: (d) => {
        toast.success(`Workflow "${d[0].name}" created`);
        router.push(`/workflows/${d[0].id}`);
        queryClient.invalidateQueries(
          trpc.workflow.getMany.queryOptions(params),
        );
      },
    }),
  );
};

const useSuspenseWorkflow = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
};

const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const [param, setParam] = useWorkflowsParams();
  const { page, pageSize, search } = param;
  const queryClient = useQueryClient();
  return useMutation(
    trpc.workflow.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data[0].name}" removed`);
        queryClient.invalidateQueries(
          trpc.workflow.getMany.queryOptions({ page, pageSize, search }),
        );
        queryClient.invalidateQueries(
          trpc.workflow.getOne.queryFilter({ id: data[0].id }),
        );
      },
    }),
  );
};

const useSuspenseWorkflowbyId = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflow.getOne.queryOptions({ id }));
};

const useExecuteWorkflow = ()=>{
  const trpc = useTRPC()
  return useMutation(
    trpc.execute.mutationOptions({
      onSuccess(data, variables, onMutateResult, context) {
        toast.success(`Workflow executed successfully ${data} executed`)
      },
      onError(errori){
        toast.error(`workflow failed to execute ${errori.message}`)
      }
    })
  )
}

export {
  getWorkflowList,
  useCreateWorkflow,
  useSuspenseWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflowbyId,
  useExecuteWorkflow
};

"use client";
import { Button } from "@/components/ui/button";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflow } from "../hooks/use-workflow";
import { useWorkflowsParams } from "../hooks/use-workflow-params";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItems,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "./entityHeader";

import {formatDistanceToNow} from 'date-fns'
import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import { WorkflowIcon } from "lucide-react";

const WorkflowContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      search={<WorkflowSearch />}
      pagination={<WorkflowPagination />}
      header={<WorkflowHeader />}
    >
      {children}
    </EntityContainer>
  );
};


const WorkflowHeader = () => {
  const { mutate } = useCreateWorkflow();
  return (
    <div>
      <EntityHeader
        title="workflow"
        description="create your new workflow"
        disabled={false}
        isActive={false}
        buttonLabel="create workflow"
        onNew={() => {
          mutate({ name: "bhaisahab" });
        }}
      />
    </div>
  );
};


const WorkflowSearch = () => {
  return (
    <EntitySearch
      value={""}
      placeholder={"search workflow"}
      onChange={() => {}}
    />
  );
};

const WorkflowPagination = () => {
  const workflows = useSuspenseWorkflow();
  const [params, setParams] = useWorkflowsParams();
  return (
    <EntityPagination
      disabled={workflows.isFetching}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
      totalPages={workflows.data.totalPages}
    />
  );
};

const WorkflowLoading = () => {
  return <LoadingView message="Loading workflow..." />;
};
const WorkflowError = () => {
  return <ErrorView message="Error Loading workflow..." />;
};

const WorkflowEmpty = () => {
  const createWorflow = useCreateWorkflow();
  const res = useUpgradeModel();
  return (
    <>
      {res?.success && res.data?.status == "active" && (
        <EmptyView
          message="you have not created any workflow"
          onNew={() => {
            createWorflow.mutate({ name: "first workfloe" });
          }}
        />
      )}
    </>
  );
};

const WorkflowItems = ({
  data,
}: {
  data: {
    id: string;
    userId: string | null;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}) => {
  const removeWorkflow = useRemoveWorkflow()
  const handleRemove = ()=>{
    if(removeWorkflow.isPending)return
    removeWorkflow.mutate({id:data.id })
  }
  return (
    <EntityItems
    subtitle={
      <>
      Updated at {formatDistanceToNow(data.updatedAt)}{" "}
      &bull;
      Created {formatDistanceToNow(data.createdAt)} {"ago"}
      </>
    }
      isRemoving={removeWorkflow.isPending}
      onRemove={handleRemove}
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-4 text-muted-foreground" />
        </div>
      }
      title={data.name}
      href={`workflows/${data.id}`}
    />
  );
};

export {
  WorkflowHeader,
  WorkflowContainer,
  WorkflowSearch,
  WorkflowLoading,
  WorkflowError,
  WorkflowEmpty,
  WorkflowItems,
};

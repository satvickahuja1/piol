"use client";
import { useCreateWorkflow, useSuspenseWorkflow } from "../hooks/use-workflow";
import { useWorkflowsParams } from "../hooks/use-workflow-params";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "./entityHeader";

const WorkflowHeader = () => {
  const {mutate} = useCreateWorkflow()
  return (
    <div>
      <EntityHeader
        title="workflow"
        description="create your new workflow"
        disabled={false}
        isActive={false}
        buttonLabel="create workflow"
        onNew={()=>{mutate({name:"naman"})}}
      />
    </div>
  );
};

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

export { WorkflowHeader, WorkflowContainer, WorkflowSearch };

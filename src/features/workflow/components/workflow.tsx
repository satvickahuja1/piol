"use client";

import { getWorkflowList } from "../hooks/use-workflow";
import { EntityList } from "./entityHeader";
import { WorkflowEmpty, WorkflowItems } from "./workflowHeader";

const WorkflowList = () => {
  const res = getWorkflowList();
  return (
    <EntityList
      renderItem={(ser) => <WorkflowItems data={ser}/>}
      getKey={(res) => res.id}
      items={res.data.item}
      emptyView={<WorkflowEmpty />}
      
    />
  );
};

export { WorkflowList };

"use client";

import { getWorkflowList } from "../hooks/use-workflow";

const WorkflowList = () => {
  const res = getWorkflowList();
  return <div>{JSON.stringify(res, null, 2)}</div>;
};



export {WorkflowList}
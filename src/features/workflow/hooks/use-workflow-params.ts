import { useQueryStates } from "nuqs";

import { workflowParams } from "../server/param";

export const useWorkflowsParams = () => {
  return useQueryStates(workflowParams);
};

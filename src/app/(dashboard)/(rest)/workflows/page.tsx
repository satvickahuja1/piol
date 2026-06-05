// import from "@/features/workflow/components/entityHeader";
import { Button } from "@/components/ui/button";
import { WorkflowList } from "@/features/workflow/components/workflow";
import { WorkflowContainer, WorkflowError, WorkflowLoading } from "@/features/workflow/components/workflowHeader";
import { workflowParamsLoader } from "@/features/workflow/server/param-loader";
import { prefetchWorkflow } from "@/features/workflow/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams : Promise<SearchParams>
}

const Workflow =  async ({searchParams}:Props) => {
  const params = await workflowParamsLoader(searchParams)
  prefetchWorkflow(params);
  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowError/>}>
          <Suspense fallback={<WorkflowLoading/>}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
};
export default Workflow;

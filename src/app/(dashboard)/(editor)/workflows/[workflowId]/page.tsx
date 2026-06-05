import {
  Editor,
  EditorError,
  EditorLoading,
} from "../../../../../features/editor/components/editor";
import { EditorHeader } from "../../../../../features/editor/components/editorHeader";
import {
  WorkflowError,
  WorkflowLoading,
} from "@/features/workflow/components/workflowHeader";
import { prefetchWorkflowById } from "@/features/workflow/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface pageProp {
  params: Promise<{ workflowId: string }>;
}

const executionIdPage = async ({ params }: pageProp) => {
  const { workflowId } = await params;
  prefetchWorkflowById({ id: workflowId });
  return (
    <div>
      <HydrateClient >
        <ErrorBoundary fallback={<EditorError />}>
          <Suspense fallback={<EditorLoading />}>
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
};
export default executionIdPage;

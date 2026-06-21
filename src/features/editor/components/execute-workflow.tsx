"use client";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflow/hooks/use-workflow";
import { FlaskConicalIcon } from "lucide-react";
import { toast } from "sonner";

export const ExecutionNodeButton = ({ workflowId }: { workflowId: string }) => {
  const execute = useExecuteWorkflow();

  const handleExecute = () => {
    execute.mutate({id : workflowId})
  };

  return (
    <Button onClick={()=>{handleExecute()}} disabled={execute.isPending}>
      <FlaskConicalIcon size={"4"} />
      <div>Execute Workflow</div>
    </Button>
  );
};

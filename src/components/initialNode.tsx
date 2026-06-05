"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNodes = memo((props: NodeProps) => {
  const [selectorOpen,setSelectorOpen] = useState<boolean>(false)
  return (
    <NodeSelector open={selectorOpen} onOpenChange={()=>{setSelectorOpen(!selectorOpen)}} >
      <WorkflowNode
        showToolbar={true}
        name="ak"
        description="raundta"
      >
        <PlaceholderNode onClick={()=>{setSelectorOpen(!selectorOpen)}} {...props}>
          <div className="cursor-pointer flex items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});
InitialNodes.displayName = "Initial Node";

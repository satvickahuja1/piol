'use client'
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../execution-nodes/base-execution-node";
import { MousePointer2Icon } from "lucide-react";
import { TriggerNodeDialog } from "./dailog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogopen, setDialogOpen] = useState<boolean>(false);
  return (
    <>
    <TriggerNodeDialog open={dialogopen} onOpenChange={()=>{setDialogOpen(!dialogopen)}}/ >
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointer2Icon}
        name="manual trigger"
        onSetting={() => {setDialogOpen(!dialogopen)}}
        onDoubleClick={() => {setDialogOpen(!dialogopen)}}
      />
    </>
  );
});

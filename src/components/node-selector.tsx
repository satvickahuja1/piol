"use client";
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import {
  GlobeIcon,
  MouseIcon,
  MousePointer,
  MousePointerIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { NodeType } from "../drizzle/schema";
import { Separator } from "../components/ui/separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};



const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger Manually",
    description: "Use this function to trigger whatever you want to trigger",
    icon: MousePointerIcon,
  },
];

const exeutionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "Executing Nodes",
    icon: MousePointerIcon,
    description:
      "use this function to execute nodes so that this can be successfull",
  },
];

interface NodeSelector {
  open: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
}

export const NodeSelector = ({
  open,
  onOpenChange,
  children,
}: NodeSelector) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const handleNodeSelect = useCallback((selection:NodeTypeOption)=>{
    if(selection.type === NodeType.MANUAL_TRIGGER){
      const nodeo = getNodes()
      const hasMultipleTrigger = nodeo.some((res)=>res.type === NodeType.MANUAL_TRIGGER)
      if(hasMultipleTrigger){
        toast.error(`multiple manual triggers not allowed`)
        return
      }
    }
    setNodes((nodes)=>{
      const hasInitialTrigger = nodes.some((res)=>res.type === NodeType.INITIAL)
      const centerX = innerWidth/2
      const centery = innerHeight/2
      const flowPosition = screenToFlowPosition({
        x : centerX + (Math.random()-.5)*100,
        y : centery + (Math.random()-.5)*100
      })
      const newNode = {
        id : createId(),
        type : selection.type,
        position : flowPosition,
        data : {}
      }
      if(hasInitialTrigger){
        return [newNode]
      }
      return [...nodes, newNode]
    })
  },[setNodes, getNodes, screenToFlowPosition, onOpenChange])
 
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((res) => {
            const Icon = res.icon;
            return (
              <div
                key={res.type}
                className="px-5 py-4 flex w-full gap-3 hover:border-l-2  border-blue-500  items-center"
                onClick={()=>{handleNodeSelect(res)}}
              >
                <div>
                  {typeof Icon == "string" ? (
                    <img src={Icon} alt={res.label} />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="font-medium ">{res.label}</div>
                  <div className="font-normal text-xs text-muted-foreground">
                    {res.description}
                  </div>
                </div>
              </div>
            );
          })}
          <Separator className="my-2 opacity-20 w-full bg-gray-300 h-[0.015]" />
          {exeutionNodes.map((res) => {
            const Icon = res.icon;
            return (
              <div
                key={res.type}
                className="px-5 py-4 flex w-full gap-3 items-center hover:border-l-2 border-blue-500 "
                onClick={()=>{handleNodeSelect(res)}}
              >
                <div>
                  {typeof Icon == "string" ? (
                    <img src={Icon} alt={res.label} />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="font-medium ">{res.label}</div>
                  <div className="font-normal text-xs text-muted-foreground">
                    {res.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

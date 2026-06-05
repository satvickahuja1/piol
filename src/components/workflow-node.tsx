"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

interface workflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSetting?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar,
  onDelete,
  onSetting,
  name,
  description,
}: workflowNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button size={"sm"} variant={"ghost"} onClick={onSetting}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button size={"sm"} variant={"ghost"} onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          className="max-w-50 text-center"
        >
          <p className="font-medium"> {name}</p>
          {description && (
            <p className="font-light text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
      {children}
    </>
  );
}

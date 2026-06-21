import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, type ReactNode } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../../components/react-flow/base-node";
import { WorkflowNode } from "../../../../components/workflow-node";
import { BaseHandle } from "../../../../components/react-flow/base-handle";
import { ExecutionNodeDialog } from "../../../execution/components/http-request/dailog";
import { NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  onSetting: () => void;
  onDoubleClick: () => void;
  children?: ReactNode;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    onSetting,
    onDoubleClick,
    children,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const handleDelete = () => {
      setNodes((current) => {
        const updatedNodes = current.filter((res) => res.id !== id);
        return updatedNodes;
      });
      setEdges((current) => {
        const updatedEdges = current.filter(
          (res) => res.source !== id && res.target !== id,
        );
        return updatedEdges;
      });
    };
    return (
      <WorkflowNode
        showToolbar={true}
        name={name}
        onSetting={onSetting}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator variant="overlay" status="error">
          <BaseNode
            className="rounded-l-3xl relative group"
            onDoubleClick={onDoubleClick}
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} height={16} width={16} alt="icon" />
              ) : (
                <Icon size={20} />
              )}
              {children}

              <BaseHandle
                id={"source-1"}
                type="source"
                position={Position.Left}
              />
             
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = "BaseTriggerNode";

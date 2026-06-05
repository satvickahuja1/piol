import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, type ReactNode } from "react";
import { BaseNode, BaseNodeContent } from "./base-node";
import { WorkflowNode } from "../workflow-node";
import { BaseHandle } from "./base-handle";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  onSetting: () => void;
  onDoubleClick: () => void;
  children?: ReactNode;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    onSetting,
    onDoubleClick,
    children,
  }: BaseExecutionNodeProps) => {
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
        <WorkflowNode showToolbar={true}  name={name} onSetting={onSetting} onDelete={handleDelete}>
          <BaseNode onDoubleClick={onDoubleClick}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} height={16} width={16} alt="icon" />
              ) : (
                <Icon size={20} />
              )}
              {children}
              <BaseHandle
                id={"taget-1"}
                type="source"
                position={Position.Left}
              />
              <BaseHandle
                id={"source-1"}
                type="target"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </WorkflowNode>
      );
  },
);

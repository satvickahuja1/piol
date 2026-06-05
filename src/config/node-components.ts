import { InitialNodes } from "../components/initialNode";
import type { NodeTypes } from "@xyflow/react";
import { NodeType } from "../drizzle/schema";
import { HttpRequestNode } from "../features/execution/components/http-request/node";
import { ManualTriggerNode } from "../features/triggers/components/manual-trigger/manual-trigger-node";
export const nodeComponents = {
  [NodeType.INITIAL]: InitialNodes,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
} as const satisfies NodeTypes;

export type registeredNodeType = keyof typeof nodeComponents;

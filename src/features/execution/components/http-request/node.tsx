"use client";

import type { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../../../../components/react-flow/base-execution-node";
import { ExecutionNodeDialog } from "./dailog";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestType = Node<HttpRequestData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestType>) => {
  const nodeData = props.data as HttpRequestData;
  const [dialogopen, setDialogOpen] = useState<boolean>(false);
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
    : "not configured";
  return (
    <>
      <ExecutionNodeDialog
        open={dialogopen}
        onSubmit={() => {}}
        
        defaultEndpoint={nodeData.endpoint}
        onOpenChange={() => {
          setDialogOpen(!dialogopen);
        }}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="http request"
        icon={GlobeIcon}
        data={nodeData}
        onSetting={() => {
          setDialogOpen(!dialogopen);
        }}
        onDoubleClick={() => {}}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";

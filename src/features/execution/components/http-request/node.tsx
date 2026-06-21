"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../../../../components/react-flow/base-execution-node";
import { ExecutionNodeDialog, FormType } from "./dailog";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestType = Node<HttpRequestData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestType>) => {
  const { setNodes } = useReactFlow();
  const nodeData = props.data as HttpRequestData;
  const [dialogopen, setDialogOpen] = useState<boolean>(false);
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
    : "not configured";
  const handleSubmit = (values: FormType) => {
    setNodes((nodes) =>
      nodes.map((res) => {
        if (res.id === props.id) {
          return {
            ...res,
            data: {
              ...res.data,
              endpoint: values.endpoint,
              body: values.body || " ",
              method: values.method || "GET",
            },
          };
        }
        return res;
      }),
    );
  };
  return (
    <>
      <ExecutionNodeDialog
        open={dialogopen}
        onSubmit={handleSubmit}
        defaultEndpoint={nodeData.endpoint}
        defaultMethod={nodeData.method}
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
        onDoubleClick={() => {
          setDialogOpen(!dialogopen);
        }}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";

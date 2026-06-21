"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  ErrorView,
  LoadingView,
} from "@/features/workflow/components/entityHeader";
import { useSuspenseWorkflowbyId } from "@/features/workflow/hooks/use-workflow";
import { EditorHeader, SidebarToggleButton } from "./editorHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PlusIcon, SaveIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import { useState, useCallback, useMemo, memo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeComponents } from "../../../config/node-components";
import { NodeSelector } from "../../../components/node-selector";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { useUpdateWorkflow } from "@/features/workflow/hooks/use-update-workflow";
import { NodeType } from "@/drizzle/schema";
import { ExecutionNodeButton } from "./execute-workflow";

export const AddNodeButton = memo(() => {
  const [selector, setSelector] = useState<boolean>(false);
  return (
    <NodeSelector
      open={selector}
      onOpenChange={() => {
        setSelector(!selector);
      }}
    >
      <Button
        variant={"ghost"}
        size={"icon"}
        className="bg-background"
        onClick={() => {}}
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

export const EditorError = () => {
  return <ErrorView message="error in editor" />;
};
export const EditorLoading = () => {
  return <LoadingView message="loading editor" />;
};

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();

  const handleSave = () => {
    if (!editor) {
      return;
    }
    const edge = editor.getEdges();
    const nodes = editor.getNodes();

    const nodes1 = nodes.map((node) => ({ ...node, type: String(node.type) }));
    const edges = edge.map((edge) => {
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle ?? "",
        targetHandle: edge.targetHandle ?? "",
      };
    });
    saveWorkflow.mutate({
      id: workflowId,
      node: nodes1,
      edges: edges,
    });
  };

  return (
    <div className="ml-auto">
      <Button
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
        size={"sm"}
      >
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};

export const EditorBreadCrumb = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href={"/workflows"}>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const setEditor = useSetAtom(editorAtom);
  const { data: workflow } = useSuspenseWorkflowbyId({ id: workflowId });
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);
  
  const hasaManualTrigger = nodes.some(
    (res) => res.type === String(NodeType.MANUAL_TRIGGER) 
  ) 
  
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <EditorHeader workflowId={workflowId} />
        <SidebarInset>
          <main className="flex flex-col h-full">
            <header className="flex items-center gap-2 p-2 border-b">
              <SidebarToggleButton />
              <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadCrumb workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
              </div>
            </header>
            <div style={{ width: "100%", height: "100%" }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                onInit={setEditor}
                proOptions={{ hideAttribution: true }}
                nodeTypes={nodeComponents}
                snapGrid={[10, 10]}
                snapToGrid
                
                panOnScroll
                // panOnDrag={false}
                selectionOnDrag
              >
                <Background variant={BackgroundVariant.Dots} />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                  <AddNodeButton />
                </Panel>
                {hasaManualTrigger && 
                <Panel position="bottom-center">
                  <ExecutionNodeButton  workflowId={workflowId}/>
                </Panel>
                }
              </ReactFlow>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

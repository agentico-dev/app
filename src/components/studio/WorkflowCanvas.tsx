
import React, { useCallback } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, Connection, NodeTypes } from '@xyflow/react';
import nodeTypes from './CustomNodes';
import '@xyflow/react/dist/style.css';

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: (event: React.MouseEvent) => void;
  setReactFlowInstance: (instance: any) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, reactFlowWrapper: React.RefObject<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  selectedNode: Node | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onAddNode: (event: React.MouseEvent) => void;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  setReactFlowInstance,
  onDrop,
  onDragOver,
  selectedNode,
  setNodes,
  onAddNode,
  reactFlowWrapper
}: WorkflowCanvasProps) {
  // Prevent default context menu on right-click
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    onDrop(event, reactFlowWrapper);
  }, [onDrop, reactFlowWrapper]);

  return (
    <div 
      ref={reactFlowWrapper} 
      className="flex-1 h-full" 
      onContextMenu={handleContextMenu}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onContextMenu={handleContextMenu}
        onInit={setReactFlowInstance}
        onDrop={handleDrop}
        onDragOver={onDragOver}
        fitView
        attributionPosition="bottom-right"
        nodeTypes={nodeTypes as NodeTypes}
        onPaneContextMenu={onAddNode}
      >
        <Background gap={16} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

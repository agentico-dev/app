
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import NodeTypes from './CustomNodes';
import EdgeTypes from './CustomEdges';
import NodeToolbar from './NodeToolbar';
import { WorkflowPanel } from './WorkflowPanel';

interface WorkflowCanvasProps {
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  setReactFlowInstance: any;
  onDrop: any;
  onDragOver: any;
  onNodeClick: any;
  onPaneClick: any;
  selectedNode: any;
  setNodes: any;
  onAddNode: any;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setReactFlowInstance,
  onDrop,
  onDragOver,
  onNodeClick,
  onPaneClick,
  selectedNode,
  setNodes,
  onAddNode,
  reactFlowWrapper
}: WorkflowCanvasProps) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    onDrop(event, reactFlowWrapper);
  };

  return (
    <div 
      className="flex-1 w-full overflow-hidden" 
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={handleDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={(node) => {
          switch (node.type) {
            case 'application': return '#ffcc00';
            case 'tool': return '#00ccff';
            case 'agent': return '#ff00cc';
            case 'task': return '#ccff00';
            case 'memory': return '#cc00ff';
            case 'reasoning': return '#00ffcc';
            case 'input': return '#cccccc';
            case 'output': return '#cccccc';
            default: return '#ffffff';
          }
        }} />
        
        <WorkflowPanel onAddNode={onAddNode} />

        {selectedNode && (
          <NodeToolbar node={selectedNode} setNodes={setNodes} />
        )}
      </ReactFlow>
    </div>
  );
}

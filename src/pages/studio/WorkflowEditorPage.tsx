
//#region imports
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Share2, 
  Download,
  Upload,
  Plus,
  Trash2,
  Loader2,
  Code
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import NodeToolbar from '@/components/studio/NodeToolbar';
import { NodePicker } from '@/components/studio/NodePicker';
import { WorkflowHeader } from '@/components/studio/WorkflowHeader';
import { initialNodes, initialEdges } from '@/components/studio/initial-elements';
import NodeTypes from '@/components/studio/CustomNodes';
import EdgeTypes from '@/components/studio/CustomEdges';
import { WorkflowNode, WorkflowEdge, NodeType } from '@/types/workflow';
//#endregion

export default function WorkflowEditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isNodePickerOpen, setIsNodePickerOpen] = useState(false);
  const [nodePickerPosition, setNodePickerPosition] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(
      { 
        ...params, 
        animated: true,
        style: { stroke: '#555', strokeWidth: 2 },
      }, 
      eds
    )),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');
      
      // Check if the dropped element is valid
      if (!type || typeof type !== 'string') return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: label || `${type.charAt(0).toUpperCase() + type.slice(1)}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onSave = useCallback(() => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call to save workflow
    setTimeout(() => {
      toast.success('Workflow saved successfully');
      setIsSaving(false);
    }, 1000);
  }, [workflowName, nodes, edges]);

  const onRun = useCallback(() => {
    setIsRunning(true);
    
    // Simulate workflow execution
    setTimeout(() => {
      toast.success('Workflow executed successfully');
      setIsRunning(false);
    }, 2000);
  }, [nodes, edges]);

  const onAddNode = useCallback((event: React.MouseEvent) => {
    if (!reactFlowWrapper.current || !reactFlowInstance) return;
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    setNodePickerPosition(position);
    setIsNodePickerOpen(true);
  }, [reactFlowInstance]);

  const handleAddNodeFromToolbar = useCallback((type: NodeType, label: string) => {
    if (!reactFlowInstance) return;
    
    // Position the node in the center of the viewport
    const viewportCenter = reactFlowInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: viewportCenter,
      data: { label },
    };
    
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  const handleNodeAdd = useCallback((type: string, label: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: nodePickerPosition,
      data: { label },
    };
    
    setNodes((nds) => nds.concat(newNode));
    setIsNodePickerOpen(false);
  }, [nodePickerPosition, setNodes]);

  const handleBackToProjects = () => {
    navigate(`/studio`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <WorkflowHeader
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        onSave={onSave}
        onRun={onRun}
        onSettings={() => setIsSettingsOpen(true)}
        onBack={handleBackToProjects}
        projectId={projectId}
        isSaving={isSaving}
        isRunning={isRunning}
        onAddNode={handleAddNodeFromToolbar}
      />
      
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
          onDrop={onDrop}
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
          
          <Panel position="bottom-right" className="bg-white/80 backdrop-blur-sm p-2 rounded-md shadow-sm border">
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={onAddNode}>
                <Plus className="mr-1 h-3 w-3" /> Add Node
              </Button>
              <Button size="sm" variant="outline">
                <Code className="mr-1 h-3 w-3" /> View Code
              </Button>
            </div>
          </Panel>

          {selectedNode && (
            <NodeToolbar node={selectedNode} setNodes={setNodes} />
          )}
        </ReactFlow>
      </div>

      {isNodePickerOpen && (
        <NodePicker 
          isOpen={isNodePickerOpen}
          setIsOpen={setIsNodePickerOpen}
          position={nodePickerPosition}
          onSelect={handleNodeAdd}
        />
      )}

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Workflow Settings</DialogTitle>
            <DialogDescription>
              Configure the settings for your workflow.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Workflow Name</label>
              <input
                id="name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Export Options</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-1 h-3 w-3" /> Export JSON
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Code className="mr-1 h-3 w-3" /> Export Code
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="justify-between sm:justify-between">
            <Button type="button" variant="destructive" size="sm">
              <Trash2 className="mr-1 h-3 w-3" /> Delete Workflow
            </Button>
            <Button type="button" onClick={() => setIsSettingsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

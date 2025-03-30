import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import '@xyflow/react/dist/style.css';
import * as Sentry from '@sentry/react';

import { useWorkflowFlow } from '@/hooks/useWorkflowFlow';
import { NodePicker } from '@/components/studio/NodePicker';
import { WorkflowHeader } from '@/components/studio/WorkflowHeader';
import { WorkflowSettingsDialog } from '@/components/studio/WorkflowSettingsDialog';
import { WorkflowCanvas } from '@/components/studio/WorkflowCanvas';
import { NodeConfigPanel } from '@/components/studio/NodeConfigPanel';

// Create a specific error boundary for workflow editor exceptions
const WorkflowEditorErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => children,
  {
    fallback: ({ error, componentStack, resetError }) => (
      <div className="p-8 border rounded-md bg-red-50 m-4">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Workflow Editor Error</h2>
        <p className="mb-4 text-red-600">{error.message}</p>
        <button 
          onClick={resetError} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reset Editor
        </button>
      </div>
    ),
    onError: (error, componentStack, eventId) => {
      console.error('Workflow Editor Error:', error);
      
      // Only report errors from this specific component
      Sentry.captureException(error, {
        tags: {
          component: 'WorkflowEditorPage',
        },
        contexts: {
          react: {
            componentStack,
          },
        },
      });
      
      toast.error(`Workflow Editor error: ${error.message}`);
    },
  }
);

// The main component wrapped with the error boundary
function WorkflowEditor() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for workflow metadata
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Use our custom hook for React Flow state and functions
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    onDragOver,
    onDrop,
    onAddNode,
    selectedNode,
    setNodes,
    reactFlowInstance,
    setReactFlowInstance,
    isNodePickerOpen,
    setIsNodePickerOpen,
    nodePickerPosition,
    handleNodeAdd,
    handleAddNodeFromToolbar,
    saveWorkflow,
    reactFlowWrapper,
    closeConfigPanel,
    saveNodeConfig,
    // Note dialog
    noteDialogElement
  } = useWorkflowFlow();

  // Handle saving the workflow
  const onSave = useCallback(() => {
    if (!saveWorkflow(workflowName)) return;

    setIsSaving(true);
    
    // Simulate API call to save workflow
    setTimeout(() => {
      toast.success('Workflow saved successfully');
      setIsSaving(false);
    }, 1000);
  }, [workflowName, saveWorkflow]);

  // Handle deploying the workflow
  const onDeploy = useCallback(() => {
    setIsDeploying(true);
    setTimeout(() => {
      toast.success('Workflow deployed successfully');
      setIsDeploying(false);
      // Simulate API call to deploy workflow with random delay between 1 and 2 seconds
    }, Math.floor(Math.random() * 1000) + 1000);
  }, []);

  // Handle running the workflow
  const onRun = useCallback(() => {
    setIsRunning(true);

    // randomly simulate an error
    const shouldError = Math.random() < 0.8; // 80% chance of error
    if (shouldError) {
      setIsRunning(false);
      toast.error('Error: Workflow execution failed');
      throw new Error('Simulated error during workflow execution');
    }
    
    // Simulate workflow execution
    setTimeout(() => {
      toast.success('Workflow executed successfully');
      setIsRunning(false);
    }, Math.floor(Math.random() * 1500) + 500);
  }, []);

  // Navigate back to projects list
  const handleBackToProjects = () => {
    navigate(`/studio`);
  };

  // Calculate main content class based on whether a node is selected
  const mainContentClass = selectedNode 
    ? 'flex flex-col h-[calc(100vh-5rem)] pr-[360px] transition-all duration-300' 
    : 'flex flex-col h-[calc(100vh-5rem)] transition-all duration-300';

  // Setup Sentry monitoring
  useEffect(() => {
    Sentry.setTag('page', 'workflow-editor');
    Sentry.setContext('workflow', {
      projectId,
      workflowName,
      nodesCount: nodes.length,
      edgesCount: edges.length,
    });
  }, [projectId, workflowName, nodes.length, edges.length]);

  return (
    <div className={mainContentClass}>
      <WorkflowHeader
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        onViewCode={() => navigate(`/studio/projects/${projectId}/code`)}
        onSave={onSave}
        onRun={onRun}
        onSettings={() => setIsSettingsOpen(true)}
        onBack={handleBackToProjects}
        projectId={projectId}
        isSaving={isSaving}
        isRunning={isRunning}
        isDeploying={isDeploying}
        onDeploy={onDeploy}
        onAddNode={handleAddNodeFromToolbar}
      />
      
      <WorkflowCanvas 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        setReactFlowInstance={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        selectedNode={selectedNode}
        setNodes={setNodes}
        onAddNode={onAddNode}
        reactFlowWrapper={reactFlowWrapper}
      />

      {isNodePickerOpen && (
        <NodePicker 
          isOpen={isNodePickerOpen}
          setIsOpen={setIsNodePickerOpen}
          position={nodePickerPosition}
          onSelect={handleNodeAdd}
        />
      )}

      <WorkflowSettingsDialog 
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
      />
      
      {/* Node config panel as a sidebar */}
      <NodeConfigPanel 
        node={selectedNode}
        onClose={closeConfigPanel}
        onSaveChanges={saveNodeConfig}
      />
      
      {/* Node note dialog */}
      {noteDialogElement}
    </div>
  );
}

// Export the wrapped component as default
export default function WorkflowEditorPage() {
  return (
    <WorkflowEditorErrorBoundary>
      <WorkflowEditor />
    </WorkflowEditorErrorBoundary>
  );
}

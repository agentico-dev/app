import { useState, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Node, 
  Edge, 
  Connection,
  ReactFlowInstance
} from '@xyflow/react';
import { initialNodes, initialEdges } from '@/components/studio/initial-elements';
import { NodeType } from '@/types/workflow';
import { toast } from 'sonner';
import { NodeNoteDialog } from '@/components/studio/NodeNoteDialog';

export function useWorkflowFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodePickerPosition, setNodePickerPosition] = useState({ x: 0, y: 0 });
  const [isNodePickerOpen, setIsNodePickerOpen] = useState(false);
  
  // Note dialog state
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteNodeId, setNoteNodeId] = useState<string | null>(null);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Connect two nodes with an edge
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

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle click on the pane (canvas)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle drag over for node dropping
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop for creating a new node
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, reactFlowWrapper: React.RefObject<HTMLDivElement>) => {
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
        data: { 
          label: label || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
          onDelete: deleteNode,
          onClone: cloneNode,
          onSettings: selectNodeForEditing,
          onAddNote: openNoteDialog,
          onEditNote: openEditNoteDialog
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handle right-click to open the node picker
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

  // Delete a node
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
    toast.success('Node deleted');
  }, [selectedNode, setNodes]);

  // Clone a node
  const cloneNode = useCallback((node: Node) => {
    if (!node || !node.position) return;
    
    // Create a new position slightly offset from the original
    const newPosition = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };
    
    const newNode: Node = {
      ...node,
      id: `${node.type}-${Date.now()}`,
      position: newPosition,
      data: {
        ...node.data,
        onDelete: deleteNode,
        onClone: cloneNode,
        onSettings: selectNodeForEditing,
        onAddNote: openNoteDialog,
        onEditNote: openEditNoteDialog
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    toast.success('Node cloned');
  }, [setNodes]);

  // Select a node for editing
  const selectNodeForEditing = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  // Open the note dialog for a node
  const openNoteDialog = useCallback((node: Node) => {
    setNoteNodeId(node.id);
    setIsNoteDialogOpen(true);
  }, []);

  // Open the note dialog for editing an existing note
  const openEditNoteDialog = useCallback((nodeId: string) => {
    setNoteNodeId(nodeId);
    setIsNoteDialogOpen(true);
  }, []);

  // Save a note for a node
  const saveNodeNote = useCallback((nodeId: string, note: string) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              note: note.trim() === '' ? undefined : note,
            },
          };
        }
        return node;
      })
    );
    
    if (note.trim() === '') {
      toast.success('Note removed');
    } else {
      toast.success('Note saved');
    }
  }, [setNodes]);

  // Get the current note text and node name for the note dialog
  const getNodeNoteDetails = useCallback((): { note: string; nodeName: string } => {
    if (!noteNodeId) return { note: '', nodeName: '' };
    
    const node = nodes.find(node => node.id === noteNodeId);
    if (!node) return { note: '', nodeName: '' };
    
    return { 
      note: typeof node.data.note === 'string' ? node.data.note : '', 
      nodeName: typeof node.data.label === 'string' ? node.data.label : 'Node' 
    };
  }, [nodes, noteNodeId]);

  // Add a node from the toolbar
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
      data: { 
        label,
        onDelete: deleteNode,
        onClone: cloneNode,
        onSettings: selectNodeForEditing,
        onAddNote: openNoteDialog,
        onEditNote: openEditNoteDialog
      },
    };
    
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes, deleteNode, cloneNode, selectNodeForEditing, openNoteDialog, openEditNoteDialog]);

  // Add a node from the node picker
  const handleNodeAdd = useCallback((type: string, label: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: nodePickerPosition,
      data: { 
        label,
        onDelete: deleteNode,
        onClone: cloneNode,
        onSettings: selectNodeForEditing,
        onAddNote: openNoteDialog,
        onEditNote: openEditNoteDialog
      },
    };
    
    setNodes((nds) => nds.concat(newNode));
    setIsNodePickerOpen(false);
  }, [nodePickerPosition, setNodes, deleteNode, cloneNode, selectNodeForEditing, openNoteDialog, openEditNoteDialog]);

  // Save workflow
  const saveWorkflow = useCallback((workflowName: string) => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return false;
    }
    
    return true;
  }, []);

  // Calculate the note dialog properties
  const noteDetails = getNodeNoteDetails();
  
  // JSX for the note dialog
  const noteDialogElement = (
    <NodeNoteDialog
      isOpen={isNoteDialogOpen}
      setIsOpen={setIsNoteDialogOpen}
      nodeId={noteNodeId || ''}
      nodeName={noteDetails.nodeName}
      initialNote={noteDetails.note}
      onSave={saveNodeNote}
    />
  );

  return {
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
    setSelectedNode,
    deleteNode,
    cloneNode,
    selectNodeForEditing,
    reactFlowInstance,
    setReactFlowInstance,
    isNodePickerOpen,
    setIsNodePickerOpen,
    nodePickerPosition,
    handleNodeAdd,
    handleAddNodeFromToolbar,
    saveWorkflow,
    reactFlowWrapper,
    setNodes,
    // Note related
    isNoteDialogOpen,
    setIsNoteDialogOpen,
    noteNodeId,
    openNoteDialog,
    openEditNoteDialog,
    saveNodeNote,
    noteDialogElement
  };
}

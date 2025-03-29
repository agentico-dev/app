
import React, { useState, useEffect } from 'react';
import { NodeToolbar as ReactFlowNodeToolbar, Node, Position } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Settings, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface NodeToolbarProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export default function NodeToolbar({ node, setNodes }: NodeToolbarProps) {
  const [label, setLabel] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Initialize state when the node changes
  useEffect(() => {
    if (node && node.data) {
      setLabel(node.data.label || '');
      setDescription(node.data.description || '');
    }
  }, [node]);

  const updateNodeData = () => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label,
              description,
            },
          };
        }
        return n;
      })
    );
    toast.success('Node updated');
  };

  const duplicateNode = () => {
    if (node.data.onClone) {
      node.data.onClone(node);
    } else {
      const nodePosition = { x: node.position.x + 50, y: node.position.y + 50 };
      
      setNodes((nds) => [
        ...nds,
        {
          ...node,
          id: `${node.type}-${Date.now()}`,
          position: nodePosition,
        },
      ]);
      
      toast.success('Node duplicated');
    }
  };

  const deleteNode = () => {
    if (node.data.onDelete) {
      node.data.onDelete(node.id);
    } else {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      toast.success('Node deleted');
    }
  };

  return (
    <ReactFlowNodeToolbar
      nodeId={node.id}
      position={Position.Top}
      offset={10}
      align="center"
      className="bg-white p-3 rounded-md shadow-md border w-[300px] z-10"
    >
      <h3 className="text-sm font-medium mb-2">Edit Node</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">Label</label>
          <Input 
            value={label} 
            onChange={(e) => setLabel(e.target.value)} 
            className="h-8 text-sm"
            onBlur={updateNodeData}
          />
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground">Description</label>
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="text-sm min-h-[60px]"
            onBlur={updateNodeData}
          />
        </div>
        
        <div className="flex gap-2 justify-between pt-1">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={duplicateNode}
          >
            <Copy className="h-3 w-3 mr-1" /> Duplicate
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={deleteNode}
          >
            <Trash2 className="h-3 w-3 mr-1" /> Delete
          </Button>
        </div>
      </div>
    </ReactFlowNodeToolbar>
  );
}

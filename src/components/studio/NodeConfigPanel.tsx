
import React, { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface NodeData extends Record<string, unknown> {
  label?: string;
  description?: string;
  note?: string;
  [key: string]: unknown;
}

interface NodeConfigPanelProps {
  node: Node<NodeData> | null;
  onClose: () => void;
  onSaveChanges: (node: Node<NodeData>, updatedData: NodeData) => void;
}

export function NodeConfigPanel({ node, onClose, onSaveChanges }: NodeConfigPanelProps) {
  const [nodeData, setNodeData] = useState<NodeData>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Effect to initialize the node data
  useEffect(() => {
    if (node && node.data) {
      setNodeData({ ...node.data });
      setIsDirty(false);
    }
  }, [node]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDirty) {
          // Maybe show a confirmation dialog
          const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
          if (confirmClose) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isDirty]);

  const handleInputChange = useCallback((key: string, value: string | boolean) => {
    setNodeData((prev) => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!node) return;
    
    onSaveChanges(node, nodeData);
    setIsDirty(false);
    toast.success('Node configuration saved');
  }, [node, nodeData, onSaveChanges]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    onClose();
  }, [onClose, isDirty]);

  if (!node) return null;

  // Determine which properties to show in the editor
  // Filter out function properties and internal properties
  const editableProperties = Object.entries(nodeData).filter(([key, value]) => {
    return (
      typeof value !== 'function' && 
      !key.startsWith('on') &&
      !['id', 'position', 'type', '__rf'].includes(key)
    );
  });

  return (
    <div className={`fixed right-0 top-0 bottom-0 w-[360px] bg-background border-l border-border shadow-lg transform transition-transform duration-300 z-20 flex flex-col overflow-hidden ${node ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Node Configuration</h3>
          <Badge variant="outline" className="ml-2">
            {node.type}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="node-label">Label</Label>
              <Input
                id="node-label"
                value={nodeData.label as string || ''}
                onChange={(e) => handleInputChange('label', e.target.value)}
                placeholder="Node Label"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-description">Description</Label>
              <Textarea
                id="node-description"
                value={nodeData.description as string || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this node's purpose"
                rows={3}
              />
            </div>

            {nodeData.note !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="node-note">Note</Label>
                <Textarea
                  id="node-note"
                  value={nodeData.note as string || ''}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Add a note to this node"
                  rows={3}
                />
              </div>
            )}

            {/* Show any additional properties that might be specific to the node type */}
            {editableProperties.map(([key, value]) => {
              if (key === 'label' || key === 'description' || key === 'note') return null;
              
              // Only show string, number or boolean properties
              if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') return null;
              
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`node-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  {typeof value === 'boolean' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`node-${key}`}
                        checked={value as boolean}
                        onChange={(e) => handleInputChange(key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Label htmlFor={`node-${key}`}>Enabled</Label>
                    </div>
                  ) : (
                    <Input
                      id={`node-${key}`}
                      value={value as string}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t p-4 flex justify-end gap-3">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

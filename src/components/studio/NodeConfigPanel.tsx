
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  
  useEffect(() => {
    if (node && node.data) {
      setNodeData({ ...node.data });
    }
  }, [node]);

  if (!node) return null;

  const handleInputChange = (key: string, value: string) => {
    setNodeData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (!node) return;
    
    onSaveChanges(node, nodeData);
    toast.success('Node configuration saved');
  };

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
    <Sheet open={!!node} onOpenChange={() => onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SheetTitle>Node Configuration</SheetTitle>
            <Badge variant="outline" className="ml-2">
              {node.type}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

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
                        onChange={(e) => handleInputChange(key, e.target.checked.toString())}
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

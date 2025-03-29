
import React from 'react';
import { Panel } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Plus, Code } from 'lucide-react';

interface WorkflowPanelProps {
  onAddNode: (event: React.MouseEvent) => void;
}

export function WorkflowPanel({ onAddNode }: WorkflowPanelProps) {
  return (
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
  );
}

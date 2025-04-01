
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface WorkflowTitleSectionProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  onBack: () => void;
  projectId?: string;
}

export function WorkflowTitleSection({
  workflowName,
  setWorkflowName,
  onBack,
  projectId
}: WorkflowTitleSectionProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={onBack} className="h-8 w-8 p-0">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <div>
        <Input
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="font-medium text-lg border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
        />
        {projectId && <p className="text-muted-foreground text-sm">Project: {projectId}</p>}
      </div>
    </div>
  );
}

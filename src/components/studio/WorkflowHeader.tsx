
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NodeType } from '@/types/workflow';
import { WorkflowTitleSection } from './WorkflowTitleSection';
import { WorkflowActions } from './WorkflowActions';
import { NodeTypesPanel } from './NodeTypesPanel';

interface WorkflowHeaderProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  onSave: () => void;
  onRun: () => void;
  onSettings: () => void;
  onBack: () => void;
  projectId?: string;
  isSaving: boolean;
  isRunning: boolean;
  onAddNode: (type: NodeType, label: string) => void;
}

export function WorkflowHeader({
  workflowName,
  setWorkflowName,
  onSave,
  onRun,
  onSettings,
  onBack,
  projectId,
  isSaving,
  isRunning,
  onAddNode
}: WorkflowHeaderProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b bg-white transition-all"
    >
      <div className="p-4 flex justify-between items-center">
        <WorkflowTitleSection 
          workflowName={workflowName}
          setWorkflowName={setWorkflowName}
          onBack={onBack}
          projectId={projectId}
        />
        
        <div className="flex items-center gap-2">
          <WorkflowActions 
            onRun={onRun}
            onSave={onSave}
            onSettings={onSettings}
            isSaving={isSaving}
            isRunning={isRunning}
          />

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <NodeTypesPanel onAddNode={onAddNode} />
      </CollapsibleContent>
    </Collapsible>
  );
}

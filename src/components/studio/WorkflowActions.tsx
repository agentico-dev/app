
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Save, Settings } from 'lucide-react';

interface WorkflowActionsProps {
  onRun: () => void;
  onSave: () => void;
  onSettings: () => void;
  isSaving: boolean;
  isRunning: boolean;
}

export function WorkflowActions({
  onRun,
  onSave,
  onSettings,
  isSaving,
  isRunning
}: WorkflowActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        className="gap-1 h-8" 
        onClick={onRun}
        disabled={isRunning}
      >
        {isRunning ? <span className="h-3 w-3 animate-spin">⟳</span> : <Play className="h-3 w-3" />}
        Run
      </Button>
      
      <Button 
        className="gap-1 h-8" 
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? <span className="h-3 w-3 animate-spin">⟳</span> : <Save className="h-3 w-3" />}
        Save
      </Button>
      
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSettings}>
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Save, Settings, Code, CloudUpload } from 'lucide-react';

interface WorkflowActionsProps {
  onViewCode: () => void;
  onRun: () => void;
  onSave: () => void;
  onSettings: () => void;
  isSaving: boolean;
  isRunning: boolean;
  isDeploying: boolean;
  onDeploy: () => void;
}

export function WorkflowActions({
  onViewCode,
  onRun,
  onSave,
  onSettings,
  isSaving,
  isRunning,
  isDeploying,
  onDeploy,
}: WorkflowActionsProps) {
  return (
    <div className="flex items-center gap-2">

      <Button size="sm" variant="outline">
        <Code className="mr-1 h-3 w-3" /> View Code
      </Button>
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
        variant="outline"
        className="gap-1 h-8"
        onClick={onDeploy}
        disabled={isDeploying}
      >
        {isDeploying ? <span className="h-3 w-3 animate-spin">⟳</span> : <CloudUpload className="h-3 w-3" />}
        Deploy
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

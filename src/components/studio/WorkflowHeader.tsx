
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Save, 
  Play, 
  Settings,
  ChevronDown,
  ChevronUp,
  AppWindow, 
  Wrench, 
  Brain, 
  ListTodo, 
  Database, 
  Lightbulb,
  FileInput,
  FileOutput
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { NodeType } from '@/types/workflow';

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

  const nodeTypes = [
    { type: 'application', label: 'Application', icon: AppWindow, color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
    { type: 'tool', label: 'Tool', icon: Wrench, color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
    { type: 'agent', label: 'Agent', icon: Brain, color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
    { type: 'task', label: 'Task', icon: ListTodo, color: 'bg-green-100 hover:bg-green-200 border-green-300' },
    { type: 'memory', label: 'Memory', icon: Database, color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
    { type: 'reasoning', label: 'Reasoning', icon: Lightbulb, color: 'bg-teal-100 hover:bg-teal-200 border-teal-300' },
    { type: 'input', label: 'Input', icon: FileInput, color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
    { type: 'output', label: 'Output', icon: FileOutput, color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' }
  ] as const;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b bg-white transition-all"
    >
      <div className="p-4 flex justify-between items-center">
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

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <div className="p-4 border-t bg-gray-50 flex flex-wrap gap-2 overflow-x-auto">
          {nodeTypes.map((nodeType) => (
            <Button
              key={nodeType.type}
              variant="outline"
              className={`flex items-center gap-1 h-8 ${nodeType.color} border`}
              onClick={() => onAddNode(nodeType.type as NodeType, nodeType.label)}
            >
              <nodeType.icon className="h-3 w-3" />
              <span className="text-xs font-medium">{nodeType.label}</span>
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

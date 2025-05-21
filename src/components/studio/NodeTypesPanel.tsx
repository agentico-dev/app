
import React from 'react';
import { NodeTypeButton } from './NodeTypeButton';
import { NodeType } from '@/types/workflow';
import {
  AppWindow,
  Wrench,
  Brain,
  ListTodo,
  Database,
  Lightbulb,
  FileInput,
  FileOutput
} from 'lucide-react';

interface NodeTypesPanelProps {
  onAddNode: (type: NodeType, label: string) => void;
}

export function NodeTypesPanel({ onAddNode }: NodeTypesPanelProps) {
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
    <div className="p-4 border-t bg-gray-50 flex flex-wrap gap-2 overflow-x-auto">
      {nodeTypes.map((nodeType) => (
        <NodeTypeButton
          key={nodeType.type}
          type={nodeType.type}
          label={nodeType.label}
          icon={nodeType.icon}
          color={nodeType.color}
          onClick={onAddNode}
        />
      ))}
    </div>
  );
}

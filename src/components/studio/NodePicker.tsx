
import React, { useEffect, useRef } from 'react';
import { NodeType } from '@/types/workflow';
import { 
  AppWindow, 
  Brain, 
  Wrench, 
  ListTodo, 
  Database, 
  Lightbulb,
  FileInput,
  FileOutput
} from 'lucide-react';

interface NodePickerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position: { x: number; y: number };
  onSelect: (type: string, label: string) => void;
}

interface NodeTypeOption {
  type: NodeType;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const nodeTypes: NodeTypeOption[] = [
  {
    type: 'application',
    label: 'Application',
    icon: AppWindow,
    description: 'External API or service',
    color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
  },
  {
    type: 'tool',
    label: 'Tool',
    icon: Wrench,
    description: 'Process or transform data',
    color: 'bg-blue-100 border-blue-300 hover:bg-blue-200'
  },
  {
    type: 'agent',
    label: 'Agent',
    icon: Brain,
    description: 'AI-powered assistant',
    color: 'bg-pink-100 border-pink-300 hover:bg-pink-200'
  },
  {
    type: 'task',
    label: 'Task',
    icon: ListTodo,
    description: 'Specific action to perform',
    color: 'bg-green-100 border-green-300 hover:bg-green-200'
  },
  {
    type: 'memory',
    label: 'Memory',
    icon: Database,
    description: 'Store context information',
    color: 'bg-purple-100 border-purple-300 hover:bg-purple-200'
  },
  {
    type: 'reasoning',
    label: 'Reasoning',
    icon: Lightbulb,
    description: 'Decision-making logic',
    color: 'bg-teal-100 border-teal-300 hover:bg-teal-200'
  },
  {
    type: 'input',
    label: 'Input',
    icon: FileInput,
    description: 'Starting point for data flow',
    color: 'bg-gray-100 border-gray-300 hover:bg-gray-200'
  },
  {
    type: 'output',
    label: 'Output',
    icon: FileOutput,
    description: 'Final result or endpoint',
    color: 'bg-gray-100 border-gray-300 hover:bg-gray-200'
  }
];

export function NodePicker({ isOpen, setIsOpen, position, onSelect }: NodePickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close the picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  const handleSelect = (type: NodeType, label: string) => {
    onSelect(type, label);
  };

  return (
    <div
      ref={pickerRef}
      className="absolute z-10 bg-white rounded-md shadow-lg border p-2 w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="text-sm font-medium p-2 border-b mb-2">Add Node</div>
      <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            className={`cursor-pointer rounded-md border p-2 transition-colors ${nodeType.color}`}
            onClick={() => handleSelect(nodeType.type, nodeType.label)}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow/type', nodeType.type);
              event.dataTransfer.setData('application/reactflow/label', nodeType.label);
              event.dataTransfer.effectAllowed = 'move';
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <nodeType.icon className="h-4 w-4" />
              <span className="font-medium">{nodeType.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{nodeType.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { 
  AppWindow, 
  Brain, 
  Wrench, 
  ListTodo, 
  Database, 
  Lightbulb,
  FileInput,
  FileOutput,
  FileText
} from 'lucide-react';
import { NodeContextMenu } from './NodeContextMenu';
import { Badge } from '@/components/ui/badge';

// Map of node types to their corresponding Lucide icons
const nodeIcons: { [key: string]: React.ElementType } = {
  application: AppWindow,
  tool: Wrench,
  agent: Brain,
  task: ListTodo,
  memory: Database,
  reasoning: Lightbulb,
  input: FileInput,
  output: FileOutput,
};

// Map of node types to their background/border colors
const nodeColors: { [key: string]: { bg: string; border: string } } = {
  application: { bg: 'bg-yellow-50', border: 'border-yellow-200' },
  tool: { bg: 'bg-blue-50', border: 'border-blue-200' },
  agent: { bg: 'bg-pink-50', border: 'border-pink-200' },
  task: { bg: 'bg-green-50', border: 'border-green-200' },
  memory: { bg: 'bg-purple-50', border: 'border-purple-200' },
  reasoning: { bg: 'bg-teal-50', border: 'border-teal-200' },
  input: { bg: 'bg-gray-50', border: 'border-gray-200' },
  output: { bg: 'bg-gray-50', border: 'border-gray-200' },
};

// Base node component with common styling and handles
interface WorkflowNodeProps extends NodeProps {
  icon: React.ElementType;
  bgColor: string;
  borderColor: string;
  data: {
    label?: string;
    description?: string;
    note?: string;
    onDelete?: (nodeId: string) => void;
    onClone?: (node: Node) => void;
    onSettings?: (node: Node) => void;
    onAddNote?: (node: Node) => void;
    onEditNote?: (nodeId: string) => void;
  };
}

const WorkflowNodeComponent = ({ 
  data, 
  icon: Icon, 
  bgColor, 
  borderColor,
  ...nodeProps
}: WorkflowNodeProps) => {
  const node = {
    id: nodeProps.id,
    type: nodeProps.type || 'default',
    position: { 
      x: nodeProps.positionAbsoluteX ?? 0, 
      y: nodeProps.positionAbsoluteY ?? 0
    },
    data: data,
  } as Node;

  const nodeContent = (
    <div className={`px-4 py-2 rounded-md shadow-sm ${bgColor} ${borderColor} border-2 min-w-[180px] relative`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white"
      />
      
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-5 w-5" />
        <span className="font-medium text-sm">{data.label || 'Node'}</span>
        
        {data.note && (
          <Badge 
            variant="outline" 
            className="ml-auto cursor-pointer bg-white border-blue-400 hover:bg-blue-50"
            onClick={() => data.onEditNote && data.onEditNote(nodeProps.id)}
          >
            <FileText className="h-3 w-3 mr-1" /> Note
          </Badge>
        )}
      </div>
      
      {data.description && (
        <p className="text-xs text-muted-foreground">{String(data.description)}</p>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white"
      />
    </div>
  );

  // Wrap node with context menu only if handlers are provided
  if (data.onDelete && data.onClone && data.onSettings && data.onAddNote) {
    return (
      <NodeContextMenu
        node={node}
        onDelete={data.onDelete}
        onClone={data.onClone}
        onSettings={data.onSettings}
        onAddNote={data.onAddNote}
      >
        {nodeContent}
      </NodeContextMenu>
    );
  }

  return nodeContent;
};

// Create specialized node components for each node type
const ApplicationNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.application}
    bgColor={nodeColors.application.bg}
    borderColor={nodeColors.application.border}
  />
));

const ToolNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.tool}
    bgColor={nodeColors.tool.bg}
    borderColor={nodeColors.tool.border}
  />
));

const AgentNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.agent}
    bgColor={nodeColors.agent.bg}
    borderColor={nodeColors.agent.border}
  />
));

const TaskNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.task}
    bgColor={nodeColors.task.bg}
    borderColor={nodeColors.task.border}
  />
));

const MemoryNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.memory}
    bgColor={nodeColors.memory.bg}
    borderColor={nodeColors.memory.border}
  />
));

const ReasoningNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.reasoning}
    bgColor={nodeColors.reasoning.bg}
    borderColor={nodeColors.reasoning.border}
  />
));

const InputNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.input}
    bgColor={nodeColors.input.bg}
    borderColor={nodeColors.input.border}
  />
));

const OutputNode = memo((props: NodeProps) => (
  <WorkflowNodeComponent
    {...props}
    icon={nodeIcons.output}
    bgColor={nodeColors.output.bg}
    borderColor={nodeColors.output.border}
  />
));

// Define all node types
const nodeTypes = {
  application: ApplicationNode,
  tool: ToolNode,
  agent: AgentNode,
  task: TaskNode,
  memory: MemoryNode,
  reasoning: ReasoningNode,
  input: InputNode,
  output: OutputNode,
};

export default nodeTypes;

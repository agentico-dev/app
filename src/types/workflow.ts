
export type NodeType = 
  | 'application' 
  | 'tool' 
  | 'agent' 
  | 'task' 
  | 'memory' 
  | 'reasoning'
  | 'input'
  | 'output';

export type ConnectionType = 'default' | 'success' | 'error' | 'data';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description?: string;
    icon?: string;
    config?: Record<string, any>;
    [key: string]: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: ConnectionType;
  animated?: boolean;
  label?: string;
  style?: React.CSSProperties;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  created_at: string;
  updated_at: string;
  created_by: string;
  version: number;
  is_published: boolean;
  environment?: 'development' | 'staging' | 'production';
  tags?: string[];
}

export interface WorkflowProject {
  id: string;
  name: string;
  description?: string;
  workflows: Workflow[];
  created_at: string;
  updated_at: string;
  created_by: string;
  is_shared: boolean;
  team_members?: string[];
  tags?: string[];
}

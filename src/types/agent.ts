
export interface Agent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tasks: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface AgentTask {
  id: string;
  name: string;
  description: string;
  expectedOutput: string;
  context: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  function: string;
  parameters?: Record<string, any>;
}

export interface AgentPlayground {
  id: string;
  name: string;
  agent_id: string;
  tools: string[];
  tasks: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

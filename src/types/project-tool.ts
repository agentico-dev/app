
/**
 * Represents a join table record between projects and AI tools
 * enabling many-to-many relationships between them
 */
export interface ProjectTool {
  id: string;
  project_id: string;
  ai_tool_id: string;
  created_at: string;
}


/**
 * Represents a join table record between projects and applications
 * enabling many-to-many relationships between them
 */
export interface ProjectApplication {
  id: string;
  project_id: string;
  application_id: string;
  created_at: string;
}

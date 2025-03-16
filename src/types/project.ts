
export interface Project {
  id: string;
  name: string;
  description: string | null;
  tools_count?: number;
  applications_count?: number;
  servers_count?: number;
  status: string;
  favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  user_email?: string | null;
}

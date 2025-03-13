
export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: AIToolStatus;
  favorite: boolean;
  applications_count: number;
  servers_count: number;
  agents_count: number;
  tags: string[];
  organization_id?: string;
  user_id?: string;
  application_service_id?: string;
  created_at: string;
  updated_at: string;
}

export type AIToolStatus = 'active' | 'development' | 'maintenance' | 'archived';

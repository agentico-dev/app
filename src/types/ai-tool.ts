
export interface AITool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: AIToolStatus;
  favorite: boolean;
  applications_count: number;
  servers_count: number;
  agents_count: number;
  tags: string[];
  organization_id?: string;
  organization_slug?: string;
  user_id?: string;
  server_id?: string;
  server_slug?: string;
  application_service_id?: string;
  created_at: string;
  updated_at: string;
}

export type AIToolStatus = 'active' | 'development' | 'maintenance' | 'archived';

// Enhanced AI Tool with related data
export interface EnhancedAITool extends AITool {
  associated: boolean;
  application_service?: {
    id: string;
    name: string;
  };
  application_api?: {
    id: string;
    name: string;
    version: string;
    slug: string;
  };
  application?: {
    id: string;
    name: string;
    slug: string;
  };
}

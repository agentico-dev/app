
// Define types for applications and related entities

export interface Application {
  id: string;
  name: string;
  description?: string;
  category?: string;
  slug: string;
  status: 'active' | 'inactive' | 'archived';
  tags?: string[];
  favorite?: boolean;
  user_id?: string;
  organization_id?: string;
  organization_slug?: string; // Added missing field
  project_id?: string;
  is_public?: boolean;
  endpoints_count?: number;
  tools_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type ApplicationStatus = 'active' | 'inactive' | 'archived';

export interface ApplicationAPI {
  id: string;
  name: string;
  description?: string;
  application_id: string;
  slug: string;
  status?: 'active' | 'inactive' | 'deprecated' | 'archived';
  version?: string;
  source_uri?: string;
  source_content?: string;
  endpoint_url?: string;
  documentation_url?: string;
  protocol?: 'REST' | 'gRPC' | 'WebSockets' | 'GraphQL';
  tags?: string[];
  content_format?: 'json' | 'yaml';
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationService {
  id: string;
  name: string;
  description?: string;
  summary?: string;
  api_id: string;
  application_id?: string;
  status?: 'active' | 'inactive' | 'archived';
  service_type?: string;
  path?: string;
  method?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationMessage {
  id: string;
  title: string;
  content: string;
  application_id: string;
  api_id?: string;
  message_type: 'notification' | 'warning' | 'error' | 'success';
  status: 'read' | 'unread';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  organization_id?: string;
  title: string;
  content: string;
  resource_type: 'project' | 'application' | 'server' | 'tool' | 'api' | 'service';
  resource_id: string;
  related_resource_id?: string;
  status: 'read' | 'unread';
  notification_type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

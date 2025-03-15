
export interface Application {
  id: string;
  name: string;
  description?: string;
  status?: string;
  category?: string;
  slug: string;
  tags?: string[];
  endpoints_count?: number;
  tools_count?: number;
  organization_id?: string;
  project_id?: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  favorite?: boolean;
}

export interface ApplicationAPI {
  id: string;
  name: string;
  description?: string;
  status?: string;
  version?: string;
  application_id?: string;
  source_uri?: string;
  source_content?: string;
  content_format?: 'json' | 'yaml';
  protocol?: 'REST' | 'gRPC' | 'WebSockets' | 'GraphQL';
  is_public?: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationService {
  id: string;
  name: string;
  description?: string;
  summary?: string;
  api_id?: string;
  path?: string;
  method?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationServiceMessage {
  id: string;
  name: string;
  description?: string;
  service_id?: string;
  message_type?: 'request' | 'response';
  schema?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationMessage {
  id: string;
  title: string;
  content: string;
  application_id?: string;
  message_type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateApplicationRequest {
  name: string;
  description?: string;
  category?: string;
  status?: string;
  tags?: string[];
  organization_id?: string;
  project_id?: string;
  is_public?: boolean;
}

export interface UpdateApplicationRequest {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  status?: string;
  tags?: string[];
  organization_id?: string;
  project_id?: string;
  is_public?: boolean;
}

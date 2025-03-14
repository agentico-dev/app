export interface Application {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: ApplicationStatus;
  favorite: boolean;
  endpoints_count: number;
  tools_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  organization_id?: string;
  organization_slug?: string;
  user_id?: string;
  project_id?: string;
  project_slug?: string;
}

export type ApplicationStatus = 'active' | 'development' | 'maintenance' | 'archived';

export interface ApplicationTag {
  tag_id: string;
  tag_name: string;
}

export interface Tag {
  id: string;
  name: string;
  category?: string;
}

export interface ResourceTags {
  resourceId: string;
  tags: Tag[];
}

export interface ApplicationAPI {
  id: string;
  name: string;
  slug: string;
  description?: string;
  application_id: string;
  status: 'active' | 'inactive' | 'deprecated';
  version?: string;
  endpoint_url?: string;
  documentation_url?: string;
  source_uri?: string;
  source_content?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationService {
  id: string;
  name: string;
  slug: string;
  description?: string;
  application_id: string;
  status: 'active' | 'inactive' | 'maintenance';
  service_type?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationMessage {
  id: string;
  title: string;
  content: string;
  application_id: string;
  message_type: 'notification' | 'alert' | 'info';
  status: 'read' | 'unread';
  created_at: string;
  updated_at: string;
}

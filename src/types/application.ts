
export interface Application {
  id: string;
  name: string;
  description?: string;
  slug: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  status?: ApplicationStatus;
  category?: string;
  favorite?: boolean;
  // helpers for the UI
  organization_slug?: string;
  endpoints_count?: number;
  tools_count?: number;
  // Add any other fields that are part of the application object
}

export type ApplicationStatus = 'active' | 'inactive' | 'maintenance' | 'deprecated' | 'archived';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  // Add any other fields that are part of the organization object
}

export interface ApplicationAPI {
  id: string;
  application_id: string;
  name: string;
  description?: string;
  slug: string;
  version?: string;
  source_uri?: string;
  source_content?: string;
  content_format?: 'json' | 'yaml';
  protocol?: string;
  is_public?: boolean;
  endpoint_url?: string; // Added missing properties
  documentation_url?: string; // Added missing properties
  status?: 'active' | 'inactive' | 'deprecated' | 'archived';
  created_at: string;
  updated_at: string;
  tags?: string[];
}

// Update the ApplicationMessage interface to include api_id
export interface ApplicationMessage {
  id: string;
  application_id: string;
  api_id?: string; // Added API relationship
  title: string;
  content: string;
  message_type: 'notification' | 'alert' | 'info';
  status: 'read' | 'unread';
  created_at: string;
  updated_at: string;
}

// Update the ApplicationService interface
export interface ApplicationService {
  id: string;
  application_id: string;
  api_id?: string; // Added API relationship
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  service_type?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Additional fields
  method?: string;
  path?: string;
  summary?: string;
}

export interface ApiResponse<T> {
  data: T[] | null;
  error: any | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
  user_id: string;
  link?: string;
  // Additional fields for enhanced notifications
  status?: 'read' | 'unread';
  notification_type?: 'info' | 'success' | 'warning' | 'error';
  content?: string;
  resource_type?: string;
  resource_id?: string;
  related_resource_id?: string;
  organization_id?: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Application {
  id: string;
  name: string;
  description?: string;
  slug: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  status?: 'active' | 'inactive' | 'maintenance';
  category?: string;
  favorite?: boolean;
  // helpers for the UI
  organization_slug?: string;
  endpoints_count?: number;
  tools_count?: number;
  // Add any other fields that are part of the application object
}

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

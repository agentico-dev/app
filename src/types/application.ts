
export interface Application {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'development' | 'maintenance' | 'archived';
  favorite: boolean;
  endpoints_count: number;
  tools_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus = 'active' | 'development' | 'maintenance' | 'archived';

export interface ApplicationTag {
  tag_id: string;
  tag_name: string;
}

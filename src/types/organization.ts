export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
  role?: string; // Adding the optional role property
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export interface OrganizationProject {
  id: string;
  name: string;
  organization_id: string;
  description: string | null;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
}

// Project creation type
export interface CreateProjectPayload {
  name: string;
  description?: string;
  organization_id?: string;
  tags?: string[];
  status?: 'Active' | 'Development' | 'Maintenance' | 'Archived';
}

// Application creation type
export interface CreateApplicationPayload {
  name: string;
  description?: string;
  organization_id?: string;
  category?: string;
  tags?: string[];
  status?: string;
}

// Server creation type
export interface CreateServerPayload {
  name: string;
  description?: string;
  organization_id?: string;
  type?: string;
  status?: string;
}

// AI Tool creation type
export interface CreateToolPayload {
  name: string;
  description?: string;
  organization_id?: string;
  category?: string;
  tags?: string[];
  status?: string;
}

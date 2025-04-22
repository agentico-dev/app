
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
  role?: string; // Adding the optional role property
  is_global?: boolean; // Flag to identify the global organization
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
  slug: string;
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
  project_id?: string;
  category?: string;
  tags?: string[];
  status?: string;
}

// Server creation type
export interface CreateServerPayload {
  name: string;
  description?: string;
  organization_id?: string;
  project_id?: string;
  type?: string;
  status?: string;
}

// AI Tool creation type
export interface CreateToolPayload {
  name: string;
  description?: string;
  organization_id?: string;
  server_id?: string;
  category?: string;
  tags?: string[];
  status?: string;
}

// Organization selection dropdown
export interface OrganizationSelectorProps {
  onOrganizationChange: (orgId: string) => void;
  selectedOrgId?: string;
  includeGlobal?: boolean;
  className?: string;
}

// Utility function to generate a valid slug from a name
export function generateSlug(name: string): string {
  // Convert to lowercase
  let slug = name.toLowerCase();
  
  // Replace spaces with dashes
  slug = slug.replace(/\s+/g, '-');
  
  // Remove special characters and ensure it follows DNS label standard
  slug = slug.replace(/[^a-z0-9-]/g, '');
  
  // Ensure it starts with an alphabetic character
  if (!/^[a-z]/.test(slug)) {
    slug = 'a-' + slug;
  }
  
  // Ensure it ends with an alphanumeric character
  if (!/[a-z0-9]$/.test(slug)) {
    slug = slug + '0';
  }
  
  // Limit to 63 characters
  slug = slug.slice(0, 63);
  
  return slug;
}

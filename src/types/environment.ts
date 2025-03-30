
export interface Environment {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  organization_id: string;
  cluster_url: string;
  credential_type: 'token' | 'certificate' | 'both';
  credential_token: string | null;
  credential_certificate: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface CreateEnvironmentPayload {
  name: string;
  description?: string;
  organization_id: string;
  cluster_url: string;
  credential_type: 'token' | 'certificate' | 'both';
  credential_token?: string;
  credential_certificate?: string;
  status?: string;
}

export interface UpdateEnvironmentPayload {
  name?: string;
  description?: string | null;
  status?: string;
  cluster_url?: string;
  credential_type?: 'token' | 'certificate' | 'both';
  credential_token?: string | null;
  credential_certificate?: string | null;
}


import { ApplicationStatus } from './application';

export interface Server {
  id: string;
  name: string;
  slug: string;
  is_public: boolean;
  description: string;
  type: string;
  status: ApplicationStatus;
  favorite: boolean;
  organization_id: string | null;
  organization_slug?: string;
  project_id?: string;
  project_slug?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

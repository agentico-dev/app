
import { ApplicationStatus } from './application';

export interface Server {
  id: string;
  name: string;
  description: string;
  type: string;
  status: ApplicationStatus;
  favorite: boolean;
  organization_id: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

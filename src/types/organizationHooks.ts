
import { Organization, OrganizationMember } from '@/types/organization';

export interface UseOrganizationsResult {
  organizations: Organization[] | undefined;
  userOrganizations: (Organization & { role: string })[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  createOrganization: ReturnType<typeof useCreateOrganizationMutation>;
}

export interface UseOrganizationMembersResult {
  members: OrganizationMember[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  addMember: ReturnType<typeof useAddMemberMutation>;
}

export interface AddMemberParams {
  email: string;
  role: 'admin' | 'member';
}

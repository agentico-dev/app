
import { Organization, OrganizationMember } from '@/types/organization';
import { 
  useCreateOrganizationMutation as createOrgMutation, 
  useAddMemberMutation as addMemberMutation 
} from '@/hooks/useOrganizationMutations';

export interface UseOrganizationsResult {
  organizations: Organization[] | undefined;
  userOrganizations: (Organization & { role: string })[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  createOrganization: ReturnType<typeof createOrgMutation>;
}

export interface UseOrganizationMembersResult {
  members: OrganizationMember[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  addMember: ReturnType<typeof addMemberMutation>;
}

export interface AddMemberParams {
  email: string;
  role: 'admin' | 'member';
}


import { useAuth } from './useAuth';
import { 
  useOrganizationsQuery, 
  useUserOrganizationsQuery, 
  useOrganizationMembersQuery 
} from './useOrganizationQueries';
import { 
  useCreateOrganizationMutation, 
  useAddMemberMutation 
} from './useOrganizationMutations';
import { 
  UseOrganizationsResult, 
  UseOrganizationMembersResult 
} from '@/types/organizationHooks';

export function useOrganizations(): UseOrganizationsResult {
  const { session } = useAuth();
  const isAuthenticated = !!session.user;
  
  const { data: organizations, isLoading, error } = useOrganizationsQuery();
  
  const { data: userOrganizations } = useUserOrganizationsQuery(session.user?.id);
  
  const createOrganization = useCreateOrganizationMutation();

  return {
    organizations,
    userOrganizations,
    isLoading,
    error,
    isAuthenticated,
    createOrganization,
  };
}

export function useOrganizationMembers(organizationId?: string): UseOrganizationMembersResult {
  const { session } = useAuth();
  const isAuthenticated = !!session.user;
  
  const { data: members, isLoading, error } = useOrganizationMembersQuery(organizationId);
  
  const addMember = useAddMemberMutation(organizationId);

  return {
    members,
    isLoading,
    error,
    isAuthenticated,
    addMember,
  };
}

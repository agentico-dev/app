
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Organization, OrganizationMember } from '@/types/organization';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { apiTable, getGlobalOrganization } from '@/utils/supabaseHelpers';

export function useOrganizations() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const isAuthenticated = !!session.user;

  // Fetch all organizations (only public and global ones for anonymous users)
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await apiTable('organizations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Map the data to ensure it matches Organization type
      const orgData = data.map((org: any): Organization => ({
        id: org.id,
        name: org.name,
        slug: org.slug || '',
        description: org.description || '',
        logo_url: org.logo_url,
        created_at: org.created_at,
        updated_at: org.updated_at,
        is_global: !!org.is_global
      }));
      
      return orgData;
    },
  });

  // Fetch user's organizations (only if authenticated) - including global org
  const { data: userOrganizations } = useQuery({
    queryKey: ['userOrganizations', session.user?.id],
    queryFn: async () => {
      if (!session.user) {
        // Return just the global organization for non-authenticated users
        const globalOrg = await getGlobalOrganization();
        return globalOrg ? [{ ...globalOrg, role: 'member' }] : [];
      }
      
      // Get user's organization memberships
      const { data: memberData, error: memberError } = await apiTable('organization_members')
        .select(`
          role,
          organization_id
        `)
        .eq('user_id', session.user.id);
      
      if (memberError) throw memberError;
      
      if (!memberData || memberData.length === 0) {
        // If user has no explicit memberships, still include global org
        const globalOrg = await getGlobalOrganization();
        return globalOrg ? [{ ...globalOrg, role: 'member' }] : [];
      }
      
      // Get all organizations the user is a member of
      const orgIds = memberData.map((item: any) => item.organization_id);
      const { data: orgsData, error: orgsError } = await apiTable('organizations')
        .select('*')
        .in('id', orgIds);
        
      if (orgsError) throw orgsError;
      
      // Also get the global organization if it's not already included
      const globalOrg = await getGlobalOrganization();
      
      let userOrgs: (Organization & { role: string })[] = orgsData.map((org: any) => {
        const memberInfo = memberData.find((item: any) => item.organization_id === org.id);
        
        // Create strongly typed Organization object
        const typedOrg: Organization & { role: string } = {
          id: org.id,
          name: org.name,
          slug: org.slug || '',
          description: org.description || '',
          logo_url: org.logo_url,
          created_at: org.created_at,
          updated_at: org.updated_at,
          role: memberInfo?.role || 'member',
          is_global: !!org.is_global
        };
        
        return typedOrg;
      });
      
      // Add global org if not already in the list
      if (globalOrg && !userOrgs.some(org => org.id === globalOrg.id)) {
        userOrgs.push({
          ...globalOrg,
          role: 'member'
        });
      }
      
      return userOrgs;
    },
    enabled: true, // Always fetch, even for anonymous users
  });

  // Create a new organization
  const createOrganization = useMutation({
    mutationFn: async (orgData: Partial<Organization>) => {
      console.log('Starting organization creation in mutation...', orgData);
      if (!session.user) throw new Error('Authentication required');
      
      // Create the organization with a simplified payload
      const { data: org, error: orgError } = await apiTable('organizations')
        .insert({
          name: orgData.name || '',
          slug: orgData.slug || orgData.name?.toLowerCase().replace(/\s+/g, '-') || '',
          description: orgData.description || null,
          logo_url: orgData.logo_url || null
        })
        .select()
        .single();
      
      console.log('Organization creation completed:', org);
      
      if (orgError) throw orgError;
      
      console.log('Adding current user as owner...');
      // Add current user as owner
      const { error: memberError } = await apiTable('organization_members')
        .insert({
          organization_id: org.id,
          user_id: session.user.id,
          role: 'owner'
        });
      
      console.log('Member added:', memberError);
      
      if (memberError) throw memberError;
      
      // Return a properly typed Organization object
      const typedOrg: Organization = {
        id: org.id,
        name: org.name,
        slug: org.slug || '',
        description: org.description || '',
        logo_url: org.logo_url,
        created_at: org.created_at,
        updated_at: org.updated_at
      };
      
      return typedOrg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['userOrganizations'] });
      toast({
        title: 'Organization created',
        description: 'Your new organization has been created successfully.',
      });
    },
    onError: (error: Error) => {
      console.error('Error in createOrganization mutation:', error);
      toast({
        title: 'Error creating organization',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    organizations,
    userOrganizations,
    isLoading,
    error,
    isAuthenticated,
    createOrganization,
  };
}

export function useOrganizationMembers(organizationId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session.user;

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['organization-members', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      
      const { data, error } = await apiTable('organization_members')
        .select('*')
        .eq('organization_id', organizationId);
      
      if (error) throw error;
      
      const typedMembers: OrganizationMember[] = data.map((member: any): OrganizationMember => ({
        id: member.id,
        organization_id: member.organization_id,
        user_id: member.user_id,
        role: member.role,
        created_at: member.created_at
      }));
      
      return typedMembers;
    },
    enabled: !!organizationId,
  });

  const addMember = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'member' }) => {
      if (!session.user) throw new Error('Authentication required');
      if (!organizationId) throw new Error('Organization ID is required');
      
      // First, get the user ID from the email
      const { data: userData, error: userError } = await apiTable('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError) throw new Error('User not found');
      
      // Then add the member
      const { data, error } = await apiTable('organization_members')
        .insert({
          organization_id: organizationId,
          user_id: userData.id,
          role: role
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      toast({
        title: 'Member added',
        description: 'The member has been added to the organization.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error adding member',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    members,
    isLoading,
    error,
    isAuthenticated,
    addMember,
  };
}

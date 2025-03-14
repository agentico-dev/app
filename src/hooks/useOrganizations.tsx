
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, apiSchema } from '@/integrations/supabase/client';
import type { Organization, OrganizationMember } from '@/types/organization';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export function useOrganizations() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const isAuthenticated = !!session.user;

  // Fetch all organizations (only public and global ones for anonymous users)
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      // Use apiSchema helper for consistent schema reference
      const { data, error } = await apiSchema.from('organizations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as unknown as Organization[];
    },
  });

  // Fetch user's organizations (only if authenticated)
  const { data: userOrganizations } = useQuery({
    queryKey: ['userOrganizations', session.user?.id],
    queryFn: async () => {
      if (!session.user) return [];
      
      // Join organizations and organization_members
      const { data, error } = await apiSchema.from('organization_members')
        .select(`
          role,
          organization_id
        `)
        .eq('user_id', session.user.id) as { data: OrganizationMember[], error: any };
      
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      // Get the full organization details
      const orgIds = data.map(item => item.organization_id);
      const { data: orgsData, error: orgsError } = await apiSchema.from('organizations')
        .select('*')
        .in('id', orgIds) as { data: Organization[], error: any };
        
      if (orgsError) throw orgsError;
      
      // Map the role to each organization
      return orgsData.map(org => {
        const memberData = data.find(item => item.organization_id === org.id);
        return {
          ...org,
          role: memberData?.role || 'member',
        } as Organization & { role: string };
      });
    },
    enabled: isAuthenticated,
  });

  // Create a new organization
  const createOrganization = useMutation({
    mutationFn: async (orgData: Partial<Organization>) => {
      console.log('Starting organization creation in mutation...', orgData);
      if (!session.user) throw new Error('Authentication required');
      
      // Create the organization with a simplified payload
      const { data: org, error: orgError } = await apiSchema.from('organizations')
        .insert({
          name: orgData.name || '',
          slug: orgData.slug || orgData.name?.toLowerCase().replace(/\s+/g, '-') || '',
          description: orgData.description || null,
          logo_url: orgData.logo_url || null
        })
        .select()
        .single() as { data: Organization, error: any };
      console.log('Organization creation completed:', org);
      
      if (orgError) throw orgError;
      
      console.log('Adding current user as owner...');
      // Add current user as owner
      const { error: memberError } = await apiSchema.from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: session.user.id,
          role: 'owner'
        });
      console.log('Member added:', memberError);
      
      if (memberError) throw memberError;
      
      return org;
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
      
      const { data, error } = await apiSchema.from('organization_members')
        .select('*')
        .eq('organization_id', organizationId);
      
      if (error) throw error;
      return data as OrganizationMember[];
    },
    enabled: !!organizationId,
  });

  const addMember = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'member' }) => {
      if (!session.user) throw new Error('Authentication required');
      if (!organizationId) throw new Error('Organization ID is required');
      
      // First, get the user ID from the email using RPC or a more direct approach
      const { data: userData, error: userError } = await supabase
        .from('api.users') // This would need to be adjusted based on your actual user table
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError) throw new Error('User not found');
      
      // Then add the member
      const { data, error } = await apiSchema.from('organization_members')
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


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
      // Use from('api.organizations') instead of rpc
      const { data, error } = await supabase
        .from('api.organizations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Organization[];
    },
  });

  // Fetch user's organizations (only if authenticated)
  const { data: userOrganizations } = useQuery({
    queryKey: ['userOrganizations', session.user?.id],
    queryFn: async () => {
      if (!session.user) return [];
      
      // Join organizations and organization_members
      const { data, error } = await supabase
        .from('api.organization_members')
        .select(`
          role,
          organization:organization_id (*)
        `)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // Transform the data to match the expected format
      return data.map(item => ({
        ...item.organization,
        role: item.role
      })) as (Organization & { role: string })[];
    },
    enabled: isAuthenticated,
  });

  // Create a new organization
  const createOrganization = useMutation({
    mutationFn: async (orgData: Partial<Organization>) => {
      if (!session.user) throw new Error('Authentication required');
      
      // Create the organization
      const { data: org, error: orgError } = await supabase
        .from('api.organizations')
        .insert({
          name: orgData.name || '',
          slug: orgData.slug || orgData.name?.toLowerCase().replace(/\s+/g, '-') || '',
          description: orgData.description || null,
          logo_url: orgData.logo_url || null
        })
        .select()
        .single();
      
      if (orgError) throw orgError;
      
      // Add current user as owner
      const { error: memberError } = await supabase
        .from('api.organization_members')
        .insert({
          organization_id: org.id,
          user_id: session.user.id,
          role: 'owner'
        });
      
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
    onError: (error) => {
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
      
      const { data, error } = await supabase
        .from('api.organization_members')
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
      
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError) throw new Error('User not found');
      
      // Then add the member
      const { data, error } = await supabase
        .from('api.organization_members')
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
    onError: (error) => {
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

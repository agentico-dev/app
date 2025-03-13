
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

  // Fetch all organizations (available to anonymous users)
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('list_organizations')
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
      
      const { data, error } = await supabase
        .rpc('list_user_organizations', { user_id: session.user.id })
        .select('*');
      
      if (error) throw error;
      return data as (Organization & { role: string })[];
    },
    enabled: isAuthenticated,
  });

  // Create a new organization
  const createOrganization = useMutation({
    mutationFn: async (orgData: Partial<Organization>) => {
      if (!session.user) throw new Error('Authentication required');
      
      // Create the organization
      const { data: org, error: orgError } = await supabase
        .rpc('create_organization', {
          org_name: orgData.name || '',
          org_slug: orgData.slug || orgData.name?.toLowerCase().replace(/\s+/g, '-') || '',
          org_description: orgData.description || null,
          org_logo_url: orgData.logo_url || null
        })
        .select()
        .single();
      
      if (orgError) throw orgError;
      
      // Add current user as owner
      const { error: memberError } = await supabase
        .rpc('add_organization_member', {
          org_id: org.id,
          member_id: session.user.id,
          member_role: 'owner'
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
        .rpc('list_organization_members', { org_id: organizationId })
        .select('*');
      
      if (error) throw error;
      return data as OrganizationMember[];
    },
    enabled: !!organizationId,
  });

  const addMember = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'member' }) => {
      if (!session.user) throw new Error('Authentication required');
      if (!organizationId) throw new Error('Organization ID is required');
      
      // For a real implementation, we'd need to:
      // 1. Find user by email
      // 2. Add them to the organization
      
      // Call the RPC function to add a member
      const { data, error } = await supabase
        .rpc('add_member_by_email', {
          org_id: organizationId,
          member_email: email,
          member_role: role
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

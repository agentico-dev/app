
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Organization } from '@/types/organization';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';
import { apiTable } from '@/utils/supabaseHelpers';
import { AddMemberParams } from '@/types/organizationHooks';

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();

  return useMutation({
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
      if (!org) throw new Error('Failed to create organization');
      
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
}

export function useAddMemberMutation(organizationId?: string) {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ email, role }: AddMemberParams) => {
      if (!session.user) throw new Error('Authentication required');
      if (!organizationId) throw new Error('Organization ID is required');
      
      // First, get the user ID from the email
      const { data: userData, error: userError } = await apiTable('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError) throw new Error('User not found');
      if (!userData) throw new Error('User not found');
      
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
}

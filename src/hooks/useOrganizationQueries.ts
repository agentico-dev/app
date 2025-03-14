
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { Organization, OrganizationMember } from '@/types/organization';
import { apiTable, getGlobalOrganization } from '@/utils/supabaseHelpers';

export function useOrganizationsQuery() {
  return useQuery({
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
}

export function useUserOrganizationsQuery(userId?: string) {
  return useQuery({
    queryKey: ['userOrganizations', userId],
    queryFn: async () => {
      if (!userId) {
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
        .eq('user_id', userId);
      
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
}

export function useOrganizationMembersQuery(organizationId?: string) {
  return useQuery({
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
}

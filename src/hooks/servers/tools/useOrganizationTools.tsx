
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedAITool } from '@/types/ai-tool';

/**
 * Hook to fetch AI tools linked to an organization
 */
export function useOrganizationTools(organizationId?: string) {
  return useQuery({
    queryKey: ['organization-tools', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('organization_id', organizationId);
      
      if (error) throw error;
      
      return data.map(tool => ({
        ...tool,
        associated: false
      })) as EnhancedAITool[];
    },
    enabled: !!organizationId,
  });
}

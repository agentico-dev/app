
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch server details including organization_id
 */
export function useServerDetails(serverId?: string) {
  return useQuery({
    queryKey: ['server-detail', serverId],
    queryFn: async () => {
      if (!serverId) return null;
      
      const { data, error } = await supabase
        .from('servers')
        .select('organization_id')
        .eq('id', serverId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!serverId,
  });
}

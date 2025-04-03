
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedAITool } from '@/types/ai-tool';

/**
 * Hook to fetch AI tools linked to a server
 */
export function useServerTools(serverId?: string) {
  return useQuery({
    queryKey: ['server-ai-tools', serverId],
    queryFn: async () => {
      if (!serverId) return [];
      
      const { data, error } = await supabase
        .from('server_tools')
        .select('*, ai_tool:ai_tool_id(*)')
        .eq('server_id', serverId);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item.ai_tool,
        associated: true
      })) as EnhancedAITool[];
    },
    enabled: !!serverId,
  });
}

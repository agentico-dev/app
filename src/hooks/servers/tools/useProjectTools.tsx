
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedAITool } from '@/types/ai-tool';

/**
 * Hook to fetch AI tools linked to a project
 */
export function useProjectTools(projectId?: string) {
  return useQuery({
    queryKey: ['project-tools', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_tools')
        .select('*, ai_tool:ai_tool_id(*)')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item.ai_tool,
        associated: false
      })) as EnhancedAITool[];
    },
    enabled: !!projectId,
  });
}

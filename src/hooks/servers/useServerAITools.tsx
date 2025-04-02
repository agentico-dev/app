
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useToast } from '@/components/ui/use-toast';

// Hook to manage server-AI tool relationships
export function useServerAITools(serverId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch AI tools linked to the server
  const { data: aiTools, isLoading, error } = useQuery({
    queryKey: ['server-ai-tools', serverId],
    queryFn: async () => {
      if (!serverId) return [];
      
      const { data, error } = await supabase
        .from('server_ai_tools')
        .select('*, ai_tool:ai_tool_id(*)')
        .eq('server_id', serverId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!serverId,
  });

  // Link an AI tool to the server
  const linkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('server_ai_tools')
        .insert({
          server_id: serverId,
          ai_tool_id: aiToolId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-ai-tools', serverId] });
      toast({
        title: 'AI Tool linked',
        description: 'The AI tool has been linked to the server successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error linking AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Unlink an AI tool from the server
  const unlinkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('server_ai_tools')
        .delete()
        .eq('server_id', serverId)
        .eq('ai_tool_id', aiToolId);
      
      if (error) throw error;
      return { serverId, aiToolId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-ai-tools', serverId] });
      toast({
        title: 'AI Tool unlinked',
        description: 'The AI tool has been unlinked from the server successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error unlinking AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    aiTools,
    isLoading,
    error,
    linkAITool,
    unlinkAITool,
  };
}


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for AI tool association mutations (link and unlink)
 */
export function useToolMutations(serverId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const linkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('server_tools')
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

  const unlinkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('server_tools')
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
    linkAITool,
    unlinkAITool
  };
}


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook to provide mutations for project-tool associations
 */
export function useProjectToolMutations(projectId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync: updateToolAssociation } = useMutation({
    mutationFn: async ({ 
      toolId, 
      action 
    }: { 
      toolId: string, 
      action: 'associate' | 'disassociate' 
    }) => {
      if (action === 'associate') {
        // Add a record to the join table
        const { error } = await supabase
          .from('project_tools')
          .insert({ 
            project_id: projectId, 
            ai_tool_id: toolId 
          });
        
        if (error) {
          // If error is duplicate key violation, we can safely ignore it
          if (error.code === '23505') {
            console.log(`Tool ${toolId} is already associated with project ${projectId}`);
            return;
          }
          throw error;
        }
      } else {
        // Remove the record from the join table
        const { error } = await supabase
          .from('project_tools')
          .delete()
          .match({ 
            project_id: projectId, 
            ai_tool_id: toolId 
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['project-tools-join', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-tools', projectId] });
    },
    onError: (error) => {
      console.error('Error updating association:', error);
      toast.error('Failed to update AI tool association');
    },
  });

  return { updateToolAssociation };
}

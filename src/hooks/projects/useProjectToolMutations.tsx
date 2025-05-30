
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
        // Remove the record from the join tables
        const { error } = await supabase
          .rpc('disassociate_tools', {
            __project_id: projectId,
            __tool_id: toolId,
          });
        
        if (error) throw error;
      }

      // Return the updated state for optimistic updates
      return { toolId, isAssociated: action === 'associate' };
    },
    onSuccess: (result) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['project-tools-join', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-tools', projectId] });
      
      // Return the result to be used by the calling component
      return result;
    },
    onError: (error) => {
      console.error('Error updating association:', error);
      toast.error('Failed to update AI tool association');
    },
  });

  return { updateToolAssociation };
}

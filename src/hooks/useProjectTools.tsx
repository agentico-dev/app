
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AITool } from '@/types/ai-tool';
import { toast } from 'sonner';

interface ProjectTool {
  id: string;
  project_id: string;
  ai_tool_id: string;
  created_at: string;
}

export function useProjectTools(projectId: string) {
  const queryClient = useQueryClient();
  const [availableTools, setAvailableTools] = useState<AITool[]>([]);
  const [associatedTools, setAssociatedTools] = useState<AITool[]>([]);

  // Fetch all AI tools
  const { data: allTools, isLoading: isLoadingAll } = useQuery({
    queryKey: ['ai-tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*');
      
      if (error) throw error;
      return data as AITool[];
    },
  });

  // Fetch AI tools associated with the project
  const { data: projectTools, isLoading: isLoadingAssociated } = useQuery({
    queryKey: ['project-tools', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data as AITool[];
    },
    enabled: !!projectId,
  });

  // Associate/disassociate AI tool with project
  const { mutateAsync: updateToolAssociation } = useMutation({
    mutationFn: async ({ 
      toolId, 
      action 
    }: { 
      toolId: string, 
      action: 'associate' | 'disassociate' 
    }) => {
      if (action === 'associate') {
        const { error } = await supabase
          .from('ai_tools')
          .update({ project_id: projectId })
          .eq('id', toolId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ai_tools')
          .update({ project_id: null })
          .eq('id', toolId);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['ai-tools'] });
      queryClient.invalidateQueries({ queryKey: ['project-tools', projectId] });
    },
    onError: (error) => {
      console.error('Error updating association:', error);
      toast.error('Failed to update AI tool association');
    },
  });

  // Set available and associated tools
  useEffect(() => {
    if (allTools && projectTools) {
      // Available tools are those not already associated with the project
      const associated = projectTools || [];
      const associatedIds = associated.map(tool => tool.id);
      
      setAvailableTools(
        allTools.filter(tool => !associatedIds.includes(tool.id))
      );
      setAssociatedTools(associated);
    }
  }, [allTools, projectTools]);

  // Handle moving tool between available and associated
  const handleMoveTool = async (
    toolId: string,
    sourceList: string,
    destinationList: string
  ) => {
    if (sourceList === 'available' && destinationList === 'associated') {
      await updateToolAssociation({ 
        toolId, 
        action: 'associate' 
      });
    } else if (sourceList === 'associated' && destinationList === 'available') {
      await updateToolAssociation({ 
        toolId, 
        action: 'disassociate' 
      });
    }
  };

  return {
    availableTools,
    associatedTools,
    isLoading: isLoadingAll || isLoadingAssociated,
    handleMoveTool,
  };
}


import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AITool } from '@/types/ai-tool';
import { ProjectTool } from '@/types/project-tool';
import { toast } from 'sonner';

export function useProjectTools(projectId: string) {
  const queryClient = useQueryClient();
  const [availableTools, setAvailableTools] = useState<AITool[]>([]);
  const [associatedTools, setAssociatedTools] = useState<AITool[]>([]);

  // Fetch project_applications to find associated applications
  const { data: projectApplications } = useQuery({
    queryKey: ['project-applications-join', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_applications')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  // Fetch AI tools linked to the associated applications' services
  const { data: applicationTools, isLoading: isLoadingApplicationTools } = useQuery({
    queryKey: ['application-tools', projectId, projectApplications],
    queryFn: async () => {
      if (!projectApplications || projectApplications.length === 0) {
        return [] as AITool[];
      }

      // Get application IDs associated with this project
      const applicationIds = projectApplications.map(pa => pa.application_id);
      
      // Find services from these applications
      const { data: services, error: servicesError } = await supabase
        .from('application_services')
        .select('id')
        .in('application_id', applicationIds);
      
      if (servicesError) throw servicesError;
      
      if (!services || services.length === 0) {
        return [] as AITool[];
      }
      
      // Find tools linked to these services
      const serviceIds = services.map(service => service.id);
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .in('application_service_id', serviceIds);
      
      if (error) throw error;
      return data as AITool[];
    },
    enabled: !!projectId && !!projectApplications,
  });

  // Fetch project_tools join records
  const { data: projectToolsJoin, isLoading: isLoadingJoin } = useQuery({
    queryKey: ['project-tools-join', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tools')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data as ProjectTool[];
    },
    enabled: !!projectId,
  });

  // Fetch AI tools associated with the project through the join table
  const { data: projectTools, isLoading: isLoadingAssociated } = useQuery({
    queryKey: ['project-tools', projectId],
    queryFn: async () => {
      if (!projectToolsJoin || projectToolsJoin.length === 0) {
        return [] as AITool[];
      }

      const toolIds = projectToolsJoin.map(join => join.ai_tool_id);
      
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .in('id', toolIds);
      
      if (error) throw error;
      return data as AITool[];
    },
    enabled: !!projectId && !!projectToolsJoin,
  });

  // Associate/disassociate AI tool with project using the join table
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
        
        if (error) throw error;
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

  // Set available and associated tools
  useEffect(() => {
    if (applicationTools && projectTools) {
      // Available tools are those linked to the applications but not already associated with the project
      const associated = projectTools || [];
      const associatedIds = associated.map(tool => tool.id);
      
      const available = applicationTools || [];
      
      setAvailableTools(
        available.filter(tool => !associatedIds.includes(tool.id))
      );
      setAssociatedTools(associated);
    }
  }, [applicationTools, projectTools]);

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
    isLoading: isLoadingApplicationTools || isLoadingAssociated || isLoadingJoin,
    hasAssociatedApplications: projectApplications && projectApplications.length > 0,
    handleMoveTool,
  };
}

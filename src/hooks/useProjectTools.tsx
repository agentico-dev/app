
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AITool, EnhancedAITool } from '@/types/ai-tool';
import { ProjectTool } from '@/types/project-tool';
import { toast } from 'sonner';

export function useProjectTools(projectId: string) {
  const queryClient = useQueryClient();
  const [availableTools, setAvailableTools] = useState<EnhancedAITool[]>([]);
  const [associatedTools, setAssociatedTools] = useState<EnhancedAITool[]>([]);

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
  // projects → project_applications → application_apis → application_services → ai_tools
  const { data: applicationTools, isLoading: isLoadingApplicationTools } = useQuery({
    queryKey: ['application-tools', projectId, projectApplications],
    queryFn: async () => {
      if (!projectApplications || projectApplications.length === 0) {
        return [] as EnhancedAITool[];
      }

      // Get application IDs associated with this project
      const applicationIds = projectApplications.map(pa => pa.application_id);

      // Use a single join query to get all tools linked to the project's applications
      // @note - prefer using inner joins to improve performance! from 550ms to 103ms
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          name,
          slug,
          application_apis!inner (
            id,
            name,
            version,
            slug,
            application_services!inner (
              id,
              name,
              ai_tools (*)
            )
          )
        `)
        .in('id', applicationIds);

      if (error) throw error;
      
      // Extract and flatten the tools from the nested structure
      const tools: EnhancedAITool[] = [];
      data?.forEach(app => {
        app.application_apis?.forEach(api => {
          api.application_services?.forEach(service => {
            if (service.ai_tools && service.ai_tools.length > 0) {
              service.ai_tools.forEach(tool => {
                tools.push({
                  ...tool as AITool,
                  associated: false, // Will be set correctly later
                  application: {
                    id: app.id,
                    name: app.name,
                    slug: app.slug
                  },
                  application_api: {
                    id: api.id,
                    name: api.name,
                    version: api.version,
                    slug: api.slug
                  },
                  application_service: {
                    id: service.id,
                    name: service.name
                  }
                });
              });
            }
          });
        });
      });

      return tools as EnhancedAITool[];
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
        return [] as EnhancedAITool[];
      }

      const toolIds = projectToolsJoin.map(join => join.ai_tool_id);
      
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .in('id', toolIds);
      
      if (error) throw error;
      return data as EnhancedAITool[];
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
      
      // Set associated flag
      const enhancedAssociated = associated.map(tool => {
        // Find the matching tool from applicationTools to get the related info
        const matchingTool = available.find(t => t.id === tool.id);
        return {
          ...tool,
          associated: true,
          application: matchingTool?.application,
          application_api: matchingTool?.application_api,
          application_service: matchingTool?.application_service
        };
      });
      
      const enhancedAvailable = available
        .filter(tool => !associatedIds.includes(tool.id))
        .map(tool => ({
          ...tool,
          associated: false
        }));
      
      setAvailableTools(enhancedAvailable);
      setAssociatedTools(enhancedAssociated);
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

  // Handle toggling association status directly
  const handleAssociationToggle = async (toolId: string, associated: boolean) => {
    await updateToolAssociation({
      toolId,
      action: associated ? 'associate' : 'disassociate'
    });
  };

  return {
    availableTools,
    associatedTools,
    isLoading: isLoadingApplicationTools || isLoadingAssociated || isLoadingJoin,
    hasAssociatedApplications: projectApplications && projectApplications.length > 0,
    handleMoveTool,
    handleAssociationToggle,
  };
}

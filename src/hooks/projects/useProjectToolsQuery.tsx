
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AITool, EnhancedAITool } from '@/types/ai-tool';
import { ProjectTool } from '@/types/project-tool';

/**
 * Hook to fetch AI tools associated with applications linked to a project
 */
export function useApplicationToolsQuery(projectId: string, projectApplications?: any[]) {
  return useQuery({
    queryKey: ['application-tools', projectId, projectApplications],
    queryFn: async () => {
      if (!projectApplications || projectApplications.length === 0) {
        return [] as EnhancedAITool[];
      }

      // Get application IDs associated with this project
      const applicationIds = projectApplications.map(pa => pa.application_id);

      // Use a single join query to get all tools linked to the project's applications
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
}

/**
 * Hook to fetch project-applications join records
 */
export function useProjectApplicationsJoinQuery(projectId: string) {
  return useQuery({
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
}

/**
 * Hook to fetch project-tools join records
 */
export function useProjectToolsJoinQuery(projectId: string) {
  return useQuery({
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
}

/**
 * Hook to fetch AI tools associated directly with a project
 */
export function useAssociatedToolsQuery(projectId: string, projectToolsJoin?: ProjectTool[]) {
  return useQuery({
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
    enabled: !!projectId && !!projectToolsJoin && projectToolsJoin.length > 0,
  });
}

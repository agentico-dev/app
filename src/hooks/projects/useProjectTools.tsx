
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EnhancedAITool } from '@/types/ai-tool';
import { 
  useProjectApplicationsJoinQuery, 
  useApplicationToolsQuery, 
  useProjectToolsJoinQuery, 
  useAssociatedToolsQuery 
} from './useProjectToolsQuery';
import { useProjectToolMutations } from './useProjectToolMutations';

export function useProjectTools(projectId: string) {
  const queryClient = useQueryClient();
  const [availableTools, setAvailableTools] = useState<EnhancedAITool[]>([]);
  const [associatedTools, setAssociatedTools] = useState<EnhancedAITool[]>([]);

  // Fetch project_applications to find associated applications
  const { data: projectApplications } = useProjectApplicationsJoinQuery(projectId);

  // Fetch AI tools linked to the associated applications' services
  const { data: applicationTools, isLoading: isLoadingApplicationTools } = 
    useApplicationToolsQuery(projectId, projectApplications);

  // Fetch project_tools join records
  const { data: projectToolsJoin, isLoading: isLoadingJoin } = 
    useProjectToolsJoinQuery(projectId);

  // Fetch AI tools associated with the project through the join table
  const { data: projectTools, isLoading: isLoadingAssociated } = 
    useAssociatedToolsQuery(projectId, projectToolsJoin);

  // Get tool mutation functions
  const { updateToolAssociation } = useProjectToolMutations(projectId);

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

  // Handle moving tool between available and associated - simplified approach
  const handleAssociationToggle = async (toolId: string, associated: boolean) => {
    try {
      // Update in the database first
      await updateToolAssociation({
        toolId,
        action: associated ? 'associate' : 'disassociate'
      });
      
      // After successful update, invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['project-tools-join', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-tools', projectId] });
      
      toast.success(`Tool ${associated ? 'associated' : 'disassociated'} successfully`);
    } catch (error) {
      console.error('Error toggling association:', error);
      toast.error('Failed to update tool association');
    }
  };

  // Handle batch toggling of tools
  const handleBatchToggle = async (toolIds: string[], associate: boolean) => {
    if (!toolIds.length) return;
    
    try {
      // Process each tool sequentially
      for (const toolId of toolIds) {
        await updateToolAssociation({
          toolId,
          action: associate ? 'associate' : 'disassociate'
        });
      }
      
      // Invalidate queries after all operations are complete
      queryClient.invalidateQueries({ queryKey: ['project-tools-join', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-tools', projectId] });
      
      toast.success(`${toolIds.length} tools ${associate ? 'associated' : 'disassociated'} successfully`);
    } catch (error) {
      console.error('Error batch toggling tools:', error);
      toast.error('Failed to update some tool associations');
      
      // Force a refresh to ensure UI is in sync with server state
      queryClient.invalidateQueries({ queryKey: ['project-tools-join', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-tools', projectId] });
    }
  };

  return {
    availableTools,
    associatedTools,
    isLoading: isLoadingApplicationTools || isLoadingAssociated || isLoadingJoin,
    hasAssociatedApplications: projectApplications && projectApplications.length > 0,
    handleAssociationToggle,
    handleBatchToggle,
  };
}

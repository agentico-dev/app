
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

  // Handle toggling association status directly with optimistic updates
  const handleAssociationToggle = async (toolId: string, associated: boolean) => {
    try {
      // First, optimistically update the UI state
      if (associated) {
        // Tool is being associated - move from available to associated
        const toolToMove = availableTools.find(tool => tool.id === toolId);
        if (toolToMove) {
          setAvailableTools(prev => prev.filter(tool => tool.id !== toolId));
          setAssociatedTools(prev => [...prev, { ...toolToMove, associated: true }]);
        }
      } else {
        // Tool is being disassociated - move from associated to available
        const toolToMove = associatedTools.find(tool => tool.id === toolId);
        if (toolToMove) {
          setAssociatedTools(prev => prev.filter(tool => tool.id !== toolId));
          setAvailableTools(prev => [...prev, { ...toolToMove, associated: false }]);
        }
      }
      
      // Then, update in the database
      await updateToolAssociation({
        toolId,
        action: associated ? 'associate' : 'disassociate'
      });
      
    } catch (error) {
      // If there's an error, revert the optimistic update
      console.error('Error toggling association:', error);
      
      // Revert the UI back in case of an error
      if (associated) {
        // Revert association - move back to available
        const toolToRevert = associatedTools.find(tool => tool.id === toolId);
        if (toolToRevert) {
          setAssociatedTools(prev => prev.filter(tool => tool.id !== toolId));
          setAvailableTools(prev => [...prev, { ...toolToRevert, associated: false }]);
        }
      } else {
        // Revert disassociation - move back to associated
        const toolToRevert = availableTools.find(tool => tool.id === toolId);
        if (toolToRevert) {
          setAvailableTools(prev => prev.filter(tool => tool.id !== toolId));
          setAssociatedTools(prev => [...prev, { ...toolToRevert, associated: true }]);
        }
      }
      
      // Show error toast
      toast.error('Failed to update tool association');
      
      // Refresh data from server
      queryClient.invalidateQueries({ queryKey: ['project-tools-join', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-tools', projectId] });
    }
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

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { EnhancedAITool } from '@/types/ai-tool';
import { useServerDetails } from './useServerDetails';
import { useServerTools } from './tools/useServerTools';
import { useProjectTools } from './tools/useProjectTools';
import { useOrganizationTools } from './tools/useOrganizationTools';
import { useToolMutations } from './tools/useToolMutations';

/**
 * Main hook to manage server-AI tool relationships
 * This hook combines multiple smaller hooks to provide comprehensive AI tools management
 */
export function useServerAITools(serverId?: string, projectId?: string) {
  const [availableTools, setAvailableTools] = useState<EnhancedAITool[]>([]);
  const [associatedTools, setAssociatedTools] = useState<EnhancedAITool[]>([]);
  const [isOrganizationLevel, setIsOrganizationLevel] = useState(false);
  
  // Fetch server information to get organization_id
  const { data: serverData } = useServerDetails(serverId);

  // Fetch AI tools from different sources
  const { data: serverTools, isLoading: isLoadingServerTools } = useServerTools(serverId);
  const { data: projectTools, isLoading: isLoadingProjectTools } = useProjectTools(projectId);
  const { data: organizationTools, isLoading: isLoadingOrgTools } = useOrganizationTools(
    serverData?.organization_id
  );

  // Get tool mutation functions
  const { linkAITool, unlinkAITool } = useToolMutations(serverId);

  // Process and separate available and associated tools
  useEffect(() => {
    if (serverTools) {
      // Set associated tools from server_tools table
      const associated = serverTools || [];
      const associatedIds = associated.map(tool => tool.id);
      
      // If project is provided, use project tools as available tools
      if (projectId && projectTools) {
        setIsOrganizationLevel(false);
        const available = projectTools.filter(tool => !associatedIds.includes(tool.id));
        setAvailableTools(available);
        setAssociatedTools(associated);
      } 
      // Otherwise use organization tools as available tools
      else if (serverData?.organization_id && organizationTools) {
        setIsOrganizationLevel(true);
        // Show warning toast about using organization-level tools
        toast.warning("Displaying organization-level AI tools. Connect this server to a project for project-specific tools.");
        
        const available = organizationTools.filter(tool => !associatedIds.includes(tool.id));
        setAvailableTools(available);
        setAssociatedTools(associated);
      } else {
        setAvailableTools([]);
        setAssociatedTools(associated);
      }
    }
  }, [serverTools, projectTools, organizationTools, projectId, serverData]);

  return {
    aiTools: [...availableTools, ...associatedTools],
    availableTools,
    associatedTools,
    isLoading: isLoadingServerTools || isLoadingProjectTools || isLoadingOrgTools,
    isOrganizationLevel,
    linkAITool,
    unlinkAITool,
  };
}


import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProjectServers } from './useProjectServers';
import { Server } from '@/types/server';
import { EnhancedAITool, AITool } from '@/types/ai-tool';

interface ServerWithTools extends Server {
  tools: EnhancedAITool[];
}

export function useProjectServerDetails(projectId: string) {
  const [serversWithTools, setServersWithTools] = useState<ServerWithTools[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    associatedServers,
    isLoadingAssociatedServers
  } = useProjectServers(projectId);
  
  // Extract server IDs
  const serverIds = associatedServers?.map(s => s.server_id) || [];
  
  // Fetch tools for each server
  const { data: serverTools, isLoading: isLoadingServerTools } = useQuery({
    queryKey: ['server-tools-all', serverIds],
    queryFn: async () => {
      if (!serverIds.length) return {};
      
      const { data, error } = await supabase
        .from('server_tools')
        .select('server_id, ai_tool:ai_tool_id(*)')
        .in('server_id', serverIds);
      
      if (error) throw error;
      
      // Group tools by server
      const toolsByServerId: Record<string, EnhancedAITool[]> = {};
      
      data.forEach(item => {
        if (!toolsByServerId[item.server_id]) {
          toolsByServerId[item.server_id] = [];
        }
        
        // Make sure ai_tool is not null and properly cast to EnhancedAITool
        if (item.ai_tool) {
          const baseTool = item.ai_tool as unknown as AITool;
          const enhancedTool: EnhancedAITool = {
            id: baseTool.id,
            name: baseTool.name,
            slug: baseTool.slug,
            description: baseTool.description || '',
            category: baseTool.category || '',
            status: baseTool.status,
            favorite: baseTool.favorite,
            applications_count: baseTool.applications_count || 0,
            servers_count: baseTool.servers_count || 0,
            agents_count: baseTool.agents_count || 0,
            tags: baseTool.tags || [],
            organization_id: baseTool.organization_id,
            organization_slug: baseTool.organization_slug,
            user_id: baseTool.user_id,
            server_id: baseTool.server_id,
            server_slug: baseTool.server_slug,
            application_service_id: baseTool.application_service_id,
            created_at: baseTool.created_at,
            updated_at: baseTool.updated_at,
            associated: true
          };
          toolsByServerId[item.server_id].push(enhancedTool);
        }
      });
      
      return toolsByServerId;
    },
    enabled: serverIds.length > 0
  });
  
  // Combine servers with their tools
  useEffect(() => {
    if (associatedServers && serverTools && !isLoadingAssociatedServers && !isLoadingServerTools) {
      const serversData = associatedServers.map(projectServer => {
        return {
          ...projectServer.server,
          tools: serverTools[projectServer.server_id] || []
        };
      });
      
      setServersWithTools(serversData);
      setIsLoading(false);
    }
  }, [associatedServers, serverTools, isLoadingAssociatedServers, isLoadingServerTools]);
  
  return {
    serversWithTools,
    isLoading: isLoadingAssociatedServers || isLoadingServerTools || isLoading
  };
}

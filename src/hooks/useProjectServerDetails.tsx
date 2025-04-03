
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProjectServers } from './useProjectServers';
import { Server } from '@/types/server';
import { EnhancedAITool } from '@/types/ai-tool';

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
        
        // Make sure ai_tool is not null and is properly cast to EnhancedAITool
        if (item.ai_tool) {
          const enhancedTool: EnhancedAITool = {
            ...item.ai_tool,
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

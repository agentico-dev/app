import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedAITool } from '@/types/ai-tool';
import { useAuth } from '../useAuth';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

// Hook to manage server-AI tool relationships
export function useServerAITools(serverId?: string, projectId?: string) {
  const { session } = useAuth();
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
  const [availableTools, setAvailableTools] = useState<EnhancedAITool[]>([]);
  const [associatedTools, setAssociatedTools] = useState<EnhancedAITool[]>([]);
  const [isOrganizationLevel, setIsOrganizationLevel] = useState(false);
  
  // Fetch server information to get organization_id
  const { data: serverData } = useQuery({
    queryKey: ['server-detail', serverId],
    queryFn: async () => {
      if (!serverId) return null;
      
      const { data, error } = await supabase
        .from('servers')
        .select('organization_id')
        .eq('id', serverId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!serverId && !projectId,
  });

  // Fetch AI tools linked to the server (server_ai_tools table)
  const { data: serverTools, isLoading: isLoadingServerTools } = useQuery({
    queryKey: ['server-ai-tools', serverId],
    queryFn: async () => {
      if (!serverId) return [];
      
      const { data, error } = await supabase
        .from('server_tools')
        .select('*, ai_tool:ai_tool_id(*)')
        .eq('server_id', serverId);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item.ai_tool,
        associated: true
      }));
    },
    enabled: !!serverId,
  });

  // Fetch AI tools linked to the project (project_tools table)
  const { data: projectTools, isLoading: isLoadingProjectTools } = useQuery({
    queryKey: ['project-tools', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_tools')
        .select('*, ai_tool:ai_tool_id(*)')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item.ai_tool,
        associated: false
      }));
    },
    enabled: !!projectId,
  });

  // Fetch organization AI tools if no project is provided
  const { data: organizationTools, isLoading: isLoadingOrgTools } = useQuery({
    queryKey: ['organization-tools', serverData?.organization_id],
    queryFn: async () => {
      if (!serverData?.organization_id) return [];
      
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('organization_id', serverData.organization_id);
      
      if (error) throw error;
      
      return data.map(tool => ({
        ...tool,
        associated: false
      }));
    },
    enabled: !!serverData?.organization_id && !projectId,
  });

  // Link an AI tool to the server
  const linkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('server_tools')
        .insert({
          server_id: serverId,
          ai_tool_id: aiToolId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-ai-tools', serverId] });
      uiToast({
        title: 'AI Tool linked',
        description: 'The AI tool has been linked to the server successfully.',
      });
    },
    onError: (error) => {
      uiToast({
        title: 'Error linking AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Unlink an AI tool from the server
  const unlinkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('server_tools')
        .delete()
        .eq('server_id', serverId)
        .eq('ai_tool_id', aiToolId);
      
      if (error) throw error;
      return { serverId, aiToolId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-ai-tools', serverId] });
      uiToast({
        title: 'AI Tool unlinked',
        description: 'The AI tool has been unlinked from the server successfully.',
      });
    },
    onError: (error) => {
      uiToast({
        title: 'Error unlinking AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

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

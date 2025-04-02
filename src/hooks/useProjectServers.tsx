
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Server } from '@/types/server';

interface ProjectServer {
  id: string;
  project_id: string;
  server_id: string;
  created_at: string;
  server: Server;
}

export function useProjectServers(projectId: string) {
  const queryClient = useQueryClient();

  // Fetch servers associated with the project
  const { 
    data: associatedServers, 
    isLoading: isLoadingAssociatedServers 
  } = useQuery({
    queryKey: ['project-servers', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_servers')
        .select('*, server:server_id(*)')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      // Map the result to get the servers with the relationship data
      return data.map(item => ({
        ...item,
        server: item.server
      })) as ProjectServer[];
    },
    enabled: !!projectId,
  });

  // Add mutation to associate a server with a project
  const associateServer = useMutation({
    mutationFn: async ({ serverId }: { serverId: string }) => {
      const { data, error } = await supabase
        .from('project_servers')
        .insert({
          project_id: projectId,
          server_id: serverId,
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-servers', projectId] });
    },
  });

  // Add mutation to disassociate a server from a project
  const disassociateServer = useMutation({
    mutationFn: async ({ serverId }: { serverId: string }) => {
      const { data, error } = await supabase
        .from('project_servers')
        .delete()
        .eq('project_id', projectId)
        .eq('server_id', serverId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-servers', projectId] });
    },
  });

  // Function to manually invalidate the query and refetch data
  const mutateAssociatedServers = () => {
    queryClient.invalidateQueries({ queryKey: ['project-servers', projectId] });
  };

  // Determine if there are associated servers
  const hasAssociatedServers = associatedServers && associatedServers.length > 0;

  return {
    associatedServers,
    isLoadingAssociatedServers,
    hasAssociatedServers,
    associateServer,
    disassociateServer,
    mutateAssociatedServers,
  };
}

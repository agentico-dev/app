
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Server } from '@/types/server';
import { toast } from 'sonner';

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
      // Optimistically update the UI
      queryClient.setQueryData(['project-servers', projectId], (oldData: ProjectServer[] | undefined) => {
        if (!oldData) return [];
        
        // Check if the server is already associated
        const existingAssociation = oldData.find(item => item.server_id === serverId);
        if (existingAssociation) return oldData;
        
        // Find the server data from another query if available
        const serverData = queryClient.getQueryData<Server[]>(['servers'])?.find(s => s.id === serverId);
        
        if (!serverData) return oldData;
        
        // Add the association
        return [
          ...oldData,
          {
            id: `temp-${Date.now()}`,
            project_id: projectId,
            server_id: serverId,
            created_at: new Date().toISOString(),
            server: serverData
          }
        ];
      });
      
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
      toast.success('Server associated with project');
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['project-servers', projectId] });
      console.error('Error associating server:', error);
      toast.error('Failed to associate server with project');
    },
  });

  // Add mutation to disassociate a server from a project
  const disassociateServer = useMutation({
    mutationFn: async ({ serverId }: { serverId: string }) => {
      // Optimistically update the UI
      queryClient.setQueryData(['project-servers', projectId], (oldData: ProjectServer[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(item => item.server_id !== serverId);
      });
      
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
      toast.success('Server removed from project');
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['project-servers', projectId] });
      console.error('Error removing server:', error);
      toast.error('Failed to remove server from project');
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

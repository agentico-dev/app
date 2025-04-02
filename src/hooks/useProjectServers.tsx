
import { useQuery } from '@tanstack/react-query';
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
  // Fetch servers associated with the project
  const { data: associatedServers, isLoading: isLoadingAssociatedServers } = useQuery({
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

  // Determine if there are associated servers
  const hasAssociatedServers = associatedServers && associatedServers.length > 0;

  return {
    associatedServers,
    isLoadingAssociatedServers,
    hasAssociatedServers,
  };
}

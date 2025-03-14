import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { Server } from '@/types/server';

export function useServers() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session.user;

  // Fetch all servers
  const { data: servers, isLoading, error } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      let query = supabase
        .from('servers')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Server[];
    },
  });

  // Create a new server
  const createServer = useMutation({
    mutationFn: async (serverData: Partial<Server>) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('servers')
        .insert({
          name: serverData.name,
          description: serverData.description,
          type: serverData.type || 'Standard',
          status: serverData.status || 'development',
          organization_id: serverData.organization_id,
          user_id: session.user.id,
          tags: serverData.tags || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast({
        title: 'Server created',
        description: 'Your new server has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating server',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update a server
  const updateServer = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Server> & { id: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data: updatedServer, error } = await supabase
        .from('servers')
        .update({
          name: data.name,
          description: data.description,
          type: data.type,
          status: data.status,
          tags: data.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedServer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast({
        title: 'Server updated',
        description: 'The server has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating server',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a server
  const deleteServer = useMutation({
    mutationFn: async (id: string) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast({
        title: 'Server deleted',
        description: 'The server has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting server',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Toggle favorite status
  const toggleFavorite = useMutation({
    mutationFn: async ({ id, favorite }: { id: string; favorite: boolean }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('servers')
        .update({ favorite })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
    onError: (error) => {
      toast({
        title: 'Error updating favorite status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    servers,
    isLoading,
    error,
    isAuthenticated,
    createServer,
    updateServer,
    deleteServer,
    toggleFavorite,
  };
}

// Get a single server by ID
export function useServer(id?: string) {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['server', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Server;
    },
    enabled: !!id,
  });
}

// Hook to manage server-application relationships
export function useServerApplications(serverId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch applications linked to the server
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['server-applications', serverId],
    queryFn: async () => {
      if (!serverId) return [];
      
      const { data, error } = await supabase
        .from('server_applications')
        .select('*, application:application_id(*)')
        .eq('server_id', serverId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!serverId,
  });

  // Link an application to the server
  const linkApplication = useMutation({
    mutationFn: async ({ serverId, applicationId }: { serverId: string; applicationId: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('server_applications')
        .insert({
          server_id: serverId,
          application_id: applicationId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-applications', serverId] });
      toast({
        title: 'Application linked',
        description: 'The application has been linked to the server successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error linking application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Unlink an application from the server
  const unlinkApplication = useMutation({
    mutationFn: async ({ serverId, applicationId }: { serverId: string; applicationId: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('server_applications')
        .delete()
        .eq('server_id', serverId)
        .eq('application_id', applicationId);
      
      if (error) throw error;
      return { serverId, applicationId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-applications', serverId] });
      toast({
        title: 'Application unlinked',
        description: 'The application has been unlinked from the server successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error unlinking application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    applications,
    isLoading,
    error,
    linkApplication,
    unlinkApplication,
  };
}

// Hook to manage server-AI tool relationships
export function useServerAITools(serverId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch AI tools linked to the server
  const { data: aiTools, isLoading, error } = useQuery({
    queryKey: ['server-ai-tools', serverId],
    queryFn: async () => {
      if (!serverId) return [];
      
      const { data, error } = await supabase
        .from('server_ai_tools')
        .select('*, ai_tool:ai_tool_id(*)')
        .eq('server_id', serverId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!serverId,
  });

  // Link an AI tool to the server
  const linkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('server_ai_tools')
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
      toast({
        title: 'AI Tool linked',
        description: 'The AI tool has been linked to the server successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error linking AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Unlink an AI tool from the server
  const unlinkAITool = useMutation({
    mutationFn: async ({ serverId, aiToolId }: { serverId: string; aiToolId: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('server_ai_tools')
        .delete()
        .eq('server_id', serverId)
        .eq('ai_tool_id', aiToolId);
      
      if (error) throw error;
      return { serverId, aiToolId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server-ai-tools', serverId] });
      toast({
        title: 'AI Tool unlinked',
        description: 'The AI tool has been unlinked from the server successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error unlinking AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    aiTools,
    isLoading,
    error,
    linkAITool,
    unlinkAITool,
  };
}

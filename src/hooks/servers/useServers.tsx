
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
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
    onSuccess: () => {
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

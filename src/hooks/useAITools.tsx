
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { AITool } from '@/types/ai-tool';

export function useAITools() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session.user;

  // Fetch all AI tools
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['ai-tools'],
    queryFn: async () => {
      const query = supabase
        .from('api.ai_tools')
        .select('*, application_service:application_service_id(id, name, application_id)')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (AITool & { application_service?: { id: string; name: string; application_id: string } })[];
    },
  });

  // Create a new AI tool linked to an application service
  const createTool = useMutation({
    mutationFn: async (toolData: Partial<AITool>) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('api.ai_tools')
        .insert({
          name: toolData.name,
          description: toolData.description,
          category: toolData.category,
          status: toolData.status || 'active',
          organization_id: toolData.organization_id,
          user_id: session.user.id,
          tags: toolData.tags || [],
          application_service_id: toolData.application_service_id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tools'] });
      toast({
        title: 'AI Tool created',
        description: 'Your new AI tool has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update an AI tool
  const updateTool = useMutation({
    mutationFn: async ({ id, ...data }: Partial<AITool> & { id: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data: updatedTool, error } = await supabase
        .from('api.ai_tools')
        .update({
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status,
          tags: data.tags,
          application_service_id: data.application_service_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedTool;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tools'] });
      toast({
        title: 'AI Tool updated',
        description: 'The AI tool has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating AI tool',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete an AI tool
  const deleteTool = useMutation({
    mutationFn: async (id: string) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('api.ai_tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['ai-tools'] });
      toast({
        title: 'AI Tool deleted',
        description: 'The AI tool has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting AI tool',
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
        .from('api.ai_tools')
        .update({ favorite })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-tools'] });
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
    tools,
    isLoading,
    error,
    isAuthenticated,
    createTool,
    updateTool,
    deleteTool,
    toggleFavorite,
  };
}

// Get a single AI tool by ID
export function useAITool(id?: string) {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['ai-tool', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('api.ai_tools')
        .select('*, application_service:application_service_id(id, name, application_id)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as AITool & { application_service?: { id: string; name: string; application_id: string } };
    },
    enabled: !!id,
  });
}

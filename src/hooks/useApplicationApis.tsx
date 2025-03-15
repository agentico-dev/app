
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { ApplicationAPI } from '@/types/application';

export function useApplicationApis(applicationId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session?.user;

  // Fetch all APIs for an application
  const { data: apis, isLoading, error } = useQuery({
    queryKey: ['application-apis', applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const { data, error } = await supabase
        .from('application_apis')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApplicationAPI[];
    },
    enabled: !!applicationId,
  });

  // Create a new API
  const createApi = useMutation({
    mutationFn: async (apiData: Partial<ApplicationAPI>) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('application_apis')
        .insert({
          name: apiData.name,
          description: apiData.description,
          application_id: apiData.application_id,
          status: apiData.status || 'active',
          version: apiData.version,
          source_uri: apiData.source_uri,
          source_content: apiData.source_content,
          tags: apiData.tags || [],
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating API:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-apis', applicationId] });
      toast({
        title: 'API created',
        description: 'The API has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating API',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update an API
  const updateApi = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ApplicationAPI> & { id: string }) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { data: updatedApi, error } = await supabase
        .from('application_apis')
        .update({
          name: data.name,
          description: data.description,
          status: data.status,
          version: data.version,
          source_uri: data.source_uri,
          source_content: data.source_content,
          tags: data.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedApi;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-apis', applicationId] });
      toast({
        title: 'API updated',
        description: 'The API has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating API',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete an API
  const deleteApi = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('application_apis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['application-apis', applicationId] });
      toast({
        title: 'API deleted',
        description: 'The API has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting API',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    apis,
    isLoading,
    error,
    isAuthenticated,
    createApi,
    updateApi,
    deleteApi,
  };
}

// Get a single API by ID
export function useApplicationApi(id?: string) {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['application-api', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('application_apis')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ApplicationAPI;
    },
    enabled: !!id,
  });
}

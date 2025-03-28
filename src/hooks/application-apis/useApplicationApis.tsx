
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { toast } from 'sonner';
import type { ApplicationAPI } from '@/types/application';
import { fetchContent } from './utils';

/**
 * Hook for managing APIs for a specific application
 */
export function useApplicationApis(applicationId?: string) {
  const { session } = useAuth();
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
      // Process the APIs to handle binary data
      return data;
    },
    enabled: !!applicationId,
  });

  // Create a new API
  const createApi = useMutation({
    mutationFn: async (apiData: Partial<ApplicationAPI> & { shouldFetchContent?: boolean }) => {
      if (!session?.user) throw new Error('Authentication required');

      const { shouldFetchContent, ...restData } = apiData;
      
      // Handle content fetching and compression
      const { contentToSave, contentFormat } = 
        await fetchContent(shouldFetchContent, restData);

      const { data, error } = await supabase
        .from('application_apis')
        .insert({
          name: restData.name,
          description: restData.description,
          application_id: restData.application_id,
          status: restData.status || 'active',
          version: restData.version,
          source_uri: restData.source_uri,
          source_content: restData.source_content || contentToSave,
          content_format: contentFormat,
          tags: restData.tags || [],
        })
        .select();

      if (error) {
        console.error('Error creating API:', error);
        throw error;
      }

      // Return the first item if data is an array
      const createdApi = Array.isArray(data) ? data[0] : data;

      // Return the data with decompressed content for immediate use
      if (createdApi.source_content) {
        try {
          createdApi.source_content = contentToSave;
        } catch (err) {
          console.error('Error with returned source_content:', err);
          createdApi.source_content = '';
        }
      }

      return createdApi;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-apis', applicationId] });
      toast.success('API created successfully');
    },
    onError: (error) => {
      toast.error('Error creating API: ' + error.message);
    },
  });

  // Update an API
  const updateApi = useMutation({
    mutationFn: async ({
      id,
      fetchContent: shouldFetchContent = false,
      ...data
    }: Partial<ApplicationAPI> & { id: string, fetchContent?: boolean }) => {
      if (!session?.user) throw new Error('Authentication required');

      console.log('Updating API with data:', { id, fetchContent: shouldFetchContent, ...data });

      // Handle content fetching and compression
      const { contentToSave, contentFormat } = 
        await fetchContent(shouldFetchContent, data);

      // Create update object with only fields we want to update
      const updateData: Record<string, any> = {};
      
      // Only include fields that are defined
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.version !== undefined) updateData.version = data.version;
      if (data.source_uri !== undefined) updateData.source_uri = data.source_uri;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.protocol !== undefined) updateData.protocol = data.protocol;
      if (data.is_public !== undefined) updateData.is_public = data.is_public;
      
      // Add compressed content to update data if it exists
      if (contentToSave !== undefined) {
        updateData.source_content = contentToSave;
        updateData.content_format = contentFormat;
      }

      // Add updated_at field
      updateData.updated_at = new Date().toISOString();
      
      console.log('Final update data to be sent to Supabase:', updateData);

      // Update the API
      const { error } = await supabase
        .from('application_apis')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating API:', error);
        throw error;
      }

      console.log('API updated successfully in Supabase');

      // Return the updated data for optimistic updates
      return { id, ...data, ...updateData };
    },
    onSuccess: (data) => {
      console.log('Update successful, invalidating queries', data);
      queryClient.invalidateQueries({ queryKey: ['application-apis', applicationId] });
      // Also invalidate the specific API query
      queryClient.invalidateQueries({ queryKey: ['application-api', data.id] });
      toast.success('API updated successfully');
    },
    onError: (error) => {
      console.error('Update API error:', error);
      toast.error('Error updating API: ' + error.message);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-apis', applicationId] });
      toast.success('API deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting API: ' + error.message);
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

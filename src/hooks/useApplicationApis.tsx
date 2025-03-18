import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { ApplicationAPI } from '@/types/application';
import { compressContent, decompressContent, base64ToUint8Array, uint8ArrayToBase64, fetchContentFromUri } from '@/utils/apiContentUtils';

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
      return data.map((api: any) => {
        if (api.source_content) {
          try {
            api.source_content = decompressContent(api.source_content);
          } catch (err) {
            console.error('Error decompressing API content:', err);
            api.source_content = ''; // Reset if decompression fails
          }
        }
        return api as ApplicationAPI;
      });
    },
    enabled: !!applicationId,
  });

  // Create a new API
  const createApi = useMutation({
    mutationFn: async (apiData: Partial<ApplicationAPI> & { fetchContent?: boolean }) => {
      if (!session?.user) throw new Error('Authentication required');

      // Extract the fetchContent flag and remove it from the data
      const { fetchContent, ...restData } = apiData;
      let contentToSave = restData.source_content || '';
      let contentFormat = restData.content_format || 'json';

      // If fetchContent is true and we have a source_uri, fetch the content
      if (fetchContent && restData.source_uri) {
        try {
          const { content, format } = await fetchContentFromUri(restData.source_uri);
          contentToSave = content;
          contentFormat = format;
        } catch (error) {
          console.error('Failed to fetch content from URI:', error);
          toast.error(`Failed to fetch content from URI: ${error.message}`);
        }
      }

      // Compress the content if it exists
      let compressedContent = null;
      if (contentToSave) {
        try {
          compressedContent = uint8ArrayToBase64(compressContent(contentToSave));
        } catch (error) {
          console.error('Error compressing content:', error);
          toast.error(`Error compressing content: ${error.message}`);
          throw error;
        }
      }

      const { data, error } = await supabase
        .from('application_apis')
        .insert({
          name: restData.name,
          description: restData.description,
          application_id: restData.application_id,
          status: restData.status || 'active',
          version: restData.version,
          source_uri: restData.source_uri,
          source_content: compressedContent,
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

  // Update an API - fixed to properly update in Supabase
  const updateApi = useMutation({
    mutationFn: async ({
      id,
      fetchContent = false,
      ...data
    }: Partial<ApplicationAPI> & { id: string, fetchContent?: boolean }) => {
      if (!session?.user) throw new Error('Authentication required');

      console.log('Updating API with data:', { id, fetchContent, ...data });

      // Handle source content and fetching from URI
      let contentToSave = data.source_content;
      let contentFormat = data.content_format || 'json';

      // If fetchContent is true and we have a source_uri, fetch the content
      if (fetchContent && data.source_uri) {
        try {
          const { content, format } = await fetchContentFromUri(data.source_uri);
          contentToSave = content;
          contentFormat = format;
        } catch (error) {
          console.error('Failed to fetch content from URI:', error);
          toast.error(`Failed to fetch content from URI: ${error.message}`);
        }
      }

      // Create update object with only fields we want to update
      const updateData: Record<string, any> = {};
      
      // Only include fields that are defined
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.version !== undefined) updateData.version = data.version;
      if (data.source_uri !== undefined) updateData.source_uri = data.source_uri;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.endpoint_url !== undefined) updateData.endpoint_url = data.endpoint_url;
      if (data.documentation_url !== undefined) updateData.documentation_url = data.documentation_url;
      if (data.protocol !== undefined) updateData.protocol = data.protocol;
      if (data.is_public !== undefined) updateData.is_public = data.is_public;
      
      // Compress the content if it exists and add to update data
      if (contentToSave !== undefined) {
        try {
          if (contentToSave) {
            updateData.source_content = uint8ArrayToBase64(compressContent(contentToSave));
            updateData.content_format = contentFormat;
          } else {
            updateData.source_content = null;
          }
        } catch (error) {
          console.error('Error compressing content:', error);
          toast.error(`Error compressing content: ${error.message}`);
          throw error;
        }
      }

      // Add updated_at field
      updateData.updated_at = new Date().toISOString();
      
      console.log('Final update data to be sent to Supabase:', updateData);

      // Use upsert instead of update to ensure the operation succeeds
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
    onSuccess: (id) => {
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

      if (error) {
        console.error('Error fetching API:', error);
        throw error;
      }

      // Process the binary data
      if (data.source_content) {
        try {
          data.source_content = decompressContent(data.source_content);
        } catch (err) {
          console.error('Error decompressing API content:', err);
          data.source_content = ''; // Reset if decompression fails
        }
      }

      console.log('Fetched API data:', data);
      return data as ApplicationAPI;
    },
    enabled: !!id,
  });
}

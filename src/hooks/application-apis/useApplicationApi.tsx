
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import type { ApplicationAPI } from '@/types/application';
import { decompressContent } from '@/utils/apiContentUtils';

/**
 * Hook for fetching a single API by ID
 */
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

      try {
        // Process the API to handle binary data
        if (data.source_content) {
          data.source_content = decompressContent(data.source_content);
        }
      } catch (err) {
        console.error('Error processing source content:', err);
        // Reset if decompression fails
        data.source_content = '';
      }

      return data as ApplicationAPI;
    },
    enabled: !!id && !!session?.user,
  });
}

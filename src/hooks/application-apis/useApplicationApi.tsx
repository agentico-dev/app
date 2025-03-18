
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import type { ApplicationAPI } from '@/types/application';

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
        // Check if we have source_content that needs to be processed
        if (data && data.source_content) {
          console.log('API has source content, length:', data.source_content.length);
        }
      } catch (err) {
        console.error('Error processing source content:', err);
        // We don't throw here to avoid breaking the entire API fetch
      }

      return data as ApplicationAPI;
    },
    enabled: !!id,
  });
}

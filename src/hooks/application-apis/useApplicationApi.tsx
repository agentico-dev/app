
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import type { ApplicationAPI } from '@/types/application';
import { processApiData } from './utils';

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

      return processApiData(data) as ApplicationAPI;
    },
    enabled: !!id,
  });
}

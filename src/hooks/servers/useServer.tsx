
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import type { Server } from '@/types/server';

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

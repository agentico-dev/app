
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useToast } from '@/components/ui/use-toast';

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

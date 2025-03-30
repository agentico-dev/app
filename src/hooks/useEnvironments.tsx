
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Environment, CreateEnvironmentPayload, UpdateEnvironmentPayload } from '@/types/environment';
import { useToast } from '@/components/ui/use-toast';
import { handleSupabaseError } from '@/utils/supabaseHelpers';

export function useEnvironments(organizationId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: environments, isLoading, error } = useQuery({
    queryKey: ['environments', organizationId],
    queryFn: async () => {
      let query = supabase
        .from('environments')
        .select('*');
      
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as Environment[];
    },
    enabled: !!organizationId
  });

  const createEnvironment = useMutation({
    mutationFn: async (newEnvironment: CreateEnvironmentPayload) => {
      const { data, error } = await supabase
        .from('environments')
        .insert([newEnvironment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments', organizationId] });
      toast({
        title: 'Environment created',
        description: 'The environment has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create environment',
        description: handleSupabaseError(error, 'An unexpected error occurred while creating the environment.'),
        variant: 'destructive',
      });
    },
  });

  const updateEnvironment = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateEnvironmentPayload & { id: string }) => {
      const { data, error } = await supabase
        .from('environments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments', organizationId] });
      toast({
        title: 'Environment updated',
        description: 'The environment has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update environment',
        description: handleSupabaseError(error, 'An unexpected error occurred while updating the environment.'),
        variant: 'destructive',
      });
    },
  });

  const deleteEnvironment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('environments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments', organizationId] });
      toast({
        title: 'Environment deleted',
        description: 'The environment has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete environment',
        description: handleSupabaseError(error, 'An unexpected error occurred while deleting the environment.'),
        variant: 'destructive',
      });
    },
  });

  return {
    environments,
    isLoading,
    error,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
  };
}

export function useEnvironment(environmentId?: string) {
  const { data: environment, isLoading, error } = useQuery({
    queryKey: ['environment', environmentId],
    queryFn: async () => {
      if (!environmentId) return null;
      
      const { data, error } = await supabase
        .from('environments')
        .select('*')
        .eq('id', environmentId)
        .single();
      
      if (error) throw error;
      return data as Environment;
    },
    enabled: !!environmentId
  });

  return {
    environment,
    isLoading,
    error,
  };
}

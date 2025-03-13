
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { Application } from '@/types/application';

export function useApplications() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session.user;

  // Fetch all applications
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Application[];
    },
  });

  // Create a new application
  const createApplication = useMutation({
    mutationFn: async (applicationData: Partial<Application>) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          name: applicationData.name,
          description: applicationData.description,
          category: applicationData.category,
          status: applicationData.status || 'Development',
          organization_id: applicationData.organization_id,
          user_id: session.user.id,
          tags: applicationData.tags || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: 'Application created',
        description: 'Your new application has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update an application
  const updateApplication = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Application> & { id: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data: updatedApp, error } = await supabase
        .from('applications')
        .update({
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status,
          tags: data.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedApp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: 'Application updated',
        description: 'The application has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating application',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete an application
  const deleteApplication = useMutation({
    mutationFn: async (id: string) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: 'Application deleted',
        description: 'The application has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting application',
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
        .from('applications')
        .update({ favorite })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
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
    applications,
    isLoading,
    error,
    isAuthenticated,
    createApplication,
    updateApplication,
    deleteApplication,
    toggleFavorite,
  };
}

// Get a single application by ID
export function useApplication(id?: string) {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Application;
    },
    enabled: !!id,
  });
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { ApplicationService } from '@/types/application';

export function useApplicationServices(applicationId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session.user;

  // Fetch all services for an application
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['application-services', applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const { data, error } = await supabase
        .from('application_services')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApplicationService[];
    },
    enabled: !!applicationId,
  });

  // Create a new service
  const createService = useMutation({
    mutationFn: async (serviceData: Partial<ApplicationService>) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('application_services')
        .insert({
          name: serviceData.name,
          description: serviceData.description,
          application_id: serviceData.application_id,
          api_id: serviceData.api_id,
          status: serviceData.status || 'active',
          service_type: serviceData.service_type,
          tags: serviceData.tags || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-services', applicationId] });
      toast({
        title: 'Service created',
        description: 'The service has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating service',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update a service
  const updateService = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ApplicationService> & { id: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data: updatedService, error } = await supabase
        .from('application_services')
        .update({
          name: data.name,
          description: data.description,
          status: data.status,
          service_type: data.service_type,
          api_id: data.api_id,
          tags: data.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedService;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-services', applicationId] });
      toast({
        title: 'Service updated',
        description: 'The service has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating service',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a service
  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('application_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['application-services', applicationId] });
      toast({
        title: 'Service deleted',
        description: 'The service has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting service',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get all services (for selecting in AI tools)
  const { data: allServices } = useQuery({
    queryKey: ['all-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('application_services')
        .select('*, application:application_id(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (ApplicationService & { application: { name: string } })[];
    },
  });

  return {
    services,
    allServices,
    isLoading,
    error,
    isAuthenticated,
    createService,
    updateService,
    deleteService,
  };
}

// Get a single service by ID
export function useApplicationService(id?: string) {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['application-service', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('application_services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ApplicationService;
    },
    enabled: !!id,
  });
}

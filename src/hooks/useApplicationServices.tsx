import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { ApplicationService } from '@/types/application';

export function useApplicationServices(applicationId?: string, apiId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session?.user;

  // Fetch all services for an application or a specific API
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['application-services', applicationId, apiId],
    queryFn: async () => {
      // If neither applicationId nor apiId is provided, return empty array
      if (!applicationId && !apiId) return [];
      
      let query = supabase
        .from('application_services')
        .select('*');
      
      // If apiId is provided, filter by api_id
      if (apiId) {
        query = query.eq('api_id', apiId);
      } 
      // Otherwise, if only applicationId is provided, filter by application_id
      else if (applicationId) {
        query = query.eq('application_id', applicationId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApplicationService[];
    },
    enabled: !!(applicationId || apiId),
  });

  // Create a new service
  const createService = useMutation({
    mutationFn: async (serviceData: Partial<ApplicationService>) => {
      if (!session?.user) throw new Error('Authentication required');
      
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
          method: serviceData.method,
          path: serviceData.path,
          summary: serviceData.summary,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both application and API queries
      if (variables.application_id) {
        queryClient.invalidateQueries({ queryKey: ['application-services', variables.application_id] });
      }
      if (variables.api_id) {
        queryClient.invalidateQueries({ queryKey: ['application-services', applicationId, variables.api_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['application-services'] });
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
      if (!session?.user) throw new Error('Authentication required');
      
      const { data: updatedService, error } = await supabase
        .from('application_services')
        .update({
          name: data.name,
          description: data.description,
          status: data.status,
          service_type: data.service_type,
          api_id: data.api_id,
          tags: data.tags,
          method: data.method,
          path: data.path,
          summary: data.summary,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedService;
    },
    onSuccess: (data) => {
      // Invalidate both application and API queries
      if (data.application_id) {
        queryClient.invalidateQueries({ queryKey: ['application-services', data.application_id] });
      }
      if (data.api_id) {
        queryClient.invalidateQueries({ queryKey: ['application-services', applicationId, data.api_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['application-services'] });
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
      if (!session?.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('application_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (_, id) => {
      // Invalidate both application and API queries
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: ['application-services', applicationId] });
      }
      if (apiId) {
        queryClient.invalidateQueries({ queryKey: ['application-services', applicationId, apiId] });
      }
      queryClient.invalidateQueries({ queryKey: ['application-services'] });
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

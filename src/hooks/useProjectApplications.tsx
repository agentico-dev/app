
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types/application';
import { toast } from 'sonner';

export interface ProjectApplication {
  id: string;
  project_id: string;
  application_id: string;
  created_at: string;
}

export function useProjectApplications(projectId: string) {
  const queryClient = useQueryClient();
  const [availableApplications, setAvailableApplications] = useState<Application[]>([]);
  const [associatedApplications, setAssociatedApplications] = useState<Application[]>([]);

  // Fetch all applications
  const { data: allApplications, isLoading: isLoadingAll } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*');
      
      if (error) throw error;
      return data as Application[];
    },
  });

  // Fetch project_applications join records
  const { data: projectApplicationsJoin, isLoading: isLoadingJoin } = useQuery({
    queryKey: ['project-applications-join', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_applications')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data as ProjectApplication[];
    },
    enabled: !!projectId,
  });

  // Fetch applications associated with the project through the join table
  const { data: projectApplications, isLoading: isLoadingAssociated } = useQuery({
    queryKey: ['project-applications', projectId],
    queryFn: async () => {
      if (!projectApplicationsJoin || projectApplicationsJoin.length === 0) {
        return [] as Application[];
      }

      const applicationIds = projectApplicationsJoin.map(join => join.application_id);
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .in('id', applicationIds);
      
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!projectId && !!projectApplicationsJoin,
  });

  // Associate/disassociate application with project using the join table
  const { mutateAsync: updateProjectAssociation } = useMutation({
    mutationFn: async ({ 
      applicationId, 
      action 
    }: { 
      applicationId: string, 
      action: 'associate' | 'disassociate' 
    }) => {
      if (action === 'associate') {
        // Add a record to the join table
        const { error } = await supabase
          .from('project_applications')
          .insert({ 
            project_id: projectId, 
            application_id: applicationId 
          });
        
        if (error) throw error;
      } else {
        // Remove the record from the join table
        const { error } = await supabase
          .from('project_applications')
          .delete()
          .match({ 
            project_id: projectId, 
            application_id: applicationId 
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['project-applications-join', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-applications', projectId] });
    },
    onError: (error) => {
      console.error('Error updating association:', error);
      toast.error('Failed to update application association');
    },
  });

  // Set available and associated applications
  useEffect(() => {
    if (allApplications && projectApplications) {
      // Available applications are those not already associated with the project
      const associated = projectApplications || [];
      const associatedIds = associated.map(app => app.id);
      
      setAvailableApplications(
        allApplications.filter(app => !associatedIds.includes(app.id))
      );
      setAssociatedApplications(associated);
    }
  }, [allApplications, projectApplications]);

  // Handle moving application between available and associated
  const handleMoveApplication = async (
    applicationId: string,
    sourceList: string,
    destinationList: string
  ) => {
    if (sourceList === 'available' && destinationList === 'associated') {
      await updateProjectAssociation({ 
        applicationId, 
        action: 'associate' 
      });
    } else if (sourceList === 'associated' && destinationList === 'available') {
      await updateProjectAssociation({ 
        applicationId, 
        action: 'disassociate' 
      });
    }
  };

  return {
    availableApplications,
    associatedApplications,
    isLoading: isLoadingAll || isLoadingAssociated || isLoadingJoin,
    handleMoveApplication,
  };
}


import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types/application';
import { toast } from 'sonner';

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

  // Fetch applications associated with the project
  const { data: projectApplications, isLoading: isLoadingAssociated } = useQuery({
    queryKey: ['project-applications', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!projectId,
  });

  // Associate/disassociate application with project
  const { mutateAsync: updateProjectAssociation } = useMutation({
    mutationFn: async ({ 
      applicationId, 
      action 
    }: { 
      applicationId: string, 
      action: 'associate' | 'disassociate' 
    }) => {
      if (action === 'associate') {
        const { error } = await supabase
          .from('applications')
          .update({ project_id: projectId })
          .eq('id', applicationId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('applications')
          .update({ project_id: null })
          .eq('id', applicationId);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['applications'] });
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
    isLoading: isLoadingAll || isLoadingAssociated,
    handleMoveApplication,
  };
}

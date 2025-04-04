
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useProjectApplications } from '@/hooks/useProjectApplications';
import { DraggableResourceList } from '../DraggableResourceList';

interface ApplicationsTabProps {
  projectId: string;
}

export function ApplicationsTab({ projectId }: ApplicationsTabProps) {
  const navigate = useNavigate();
  const { 
    availableApplications, 
    associatedApplications, 
    isLoading: isLoadingApplications,
    handleMoveApplication
  } = useProjectApplications(projectId);

  const handleCreateApplication = () => {
    navigate('/applications/new', { state: { projectId } });
  };

  if (isLoadingApplications) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DraggableResourceList
      key={`applications-${associatedApplications.length}-${availableApplications.length}`}
      projectId={projectId}
      availableResources={availableApplications}
      associatedResources={associatedApplications}
      resourceType="application"
      onResourceMoved={handleMoveApplication}
      createButtonLabel="Create Application"
      onCreateClick={handleCreateApplication}
    />
  );
}

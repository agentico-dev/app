
import { AppWindow, CircuitBoard, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTabs } from '../../detail/ResourceTabs';
import { Project } from '@/types/project';
import { DraggableResourceList } from './DraggableResourceList';
import { useProjectApplications } from '@/hooks/useProjectApplications';
import { useProjectTools } from '@/hooks/useProjectTools';
import { useNavigate } from 'react-router';

interface ProjectTabsProps {
  project: Project;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  const navigate = useNavigate();
  const { 
    availableApplications, 
    associatedApplications, 
    isLoading: isLoadingApplications,
    handleMoveApplication
  } = useProjectApplications(project.id);

  const { 
    availableTools, 
    associatedTools, 
    isLoading: isLoadingTools,
    handleMoveTool
  } = useProjectTools(project.id);

  const handleCreateApplication = () => {
    navigate('/applications/new', { state: { projectId: project.id } });
  };

  const handleCreateTool = () => {
    navigate('/tools/new', { state: { projectId: project.id } });
  };

  return (
    <ResourceTabs
      defaultTab="applications"
      tabs={[
        {
          value: 'overview',
          label: 'Overview',
          description: 'Detailed information about this project',
          content: (
            <p className="text-muted-foreground">
              {project.description || 'No detailed description available for this project.'}
            </p>
          ),
        },
        {
          value: 'applications',
          label: 'Applications',
          description: 'Manage applications associated with this project',
          content: isLoadingApplications ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DraggableResourceList
              projectId={project.id}
              availableResources={availableApplications}
              associatedResources={associatedApplications}
              resourceType="application"
              onResourceMoved={handleMoveApplication}
              createButtonLabel="Create Application"
              onCreateClick={handleCreateApplication}
            />
          ),
        },
        {
          value: 'tools',
          label: 'AI Tools',
          description: 'Manage AI tools associated with this project',
          content: isLoadingTools ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DraggableResourceList
              projectId={project.id}
              availableResources={availableTools}
              associatedResources={associatedTools}
              resourceType="tool"
              onResourceMoved={handleMoveTool}
              createButtonLabel="Create AI Tool"
              onCreateClick={handleCreateTool}
            />
          ),
        },
      ]}
    />
  );
}


import { AppWindow, CircuitBoard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTabs } from '../../detail/ResourceTabs';
import { Project } from '@/types/project';

interface ProjectTabsProps {
  project: Project;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <ResourceTabs
      defaultTab="overview"
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
          description: 'Applications associated with this project',
          content: project.applications_count ? (
            <p>Applications will be listed here.</p>
          ) : (
            <div className="text-center p-6">
              <AppWindow className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Applications</h3>
              <p className="text-muted-foreground mb-4">
                There are no applications associated with this project yet.
              </p>
              <Button>Create Application</Button>
            </div>
          ),
        },
        {
          value: 'services',
          label: 'Services',
          description: 'Services associated with this project',
          content: (
            <p className="text-center text-muted-foreground p-6">
              Services information will be displayed here.
            </p>
          ),
        },
        {
          value: 'tools',
          label: 'AI Tools',
          description: 'AI tools associated with this project',
          content: project.tools_count ? (
            <p>AI Tools will be listed here.</p>
          ) : (
            <div className="text-center p-6">
              <CircuitBoard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No AI Tools</h3>
              <p className="text-muted-foreground mb-4">
                There are no AI tools associated with this project yet.
              </p>
              <Button>Create AI Tool</Button>
            </div>
          ),
        },
      ]}
    />
  );
}

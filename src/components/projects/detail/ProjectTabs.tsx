
import { AppWindow, CircuitBoard, Server } from 'lucide-react';
import { ResourceTabs } from '../../detail/ResourceTabs';
import { Project } from '@/types/project';
import { 
  ApplicationsTab, 
  OverviewTab, 
  ServersTab, 
  ToolsTab 
} from './tabs';

interface ProjectTabsProps {
  project: Project;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <ResourceTabs
      defaultTab="applications"
      tabs={[
        {
          value: 'overview',
          label: 'Overview',
          description: 'Detailed information about this project',
          content: <OverviewTab description={project.description} />,
        },
        {
          value: 'applications',
          label: 'Applications',
          description: 'Manage applications associated with this project',
          content: <ApplicationsTab projectId={project.id} />,
        },
        {
          value: 'tools',
          label: 'AI Tools',
          description: 'Manage AI tools associated with this project',
          content: <ToolsTab projectId={project.id} />,
        },
        {
          value: 'servers',
          label: 'Servers',
          description: 'Manage servers associated with this project',
          content: <ServersTab projectId={project.id} />,
        },
      ]}
    />
  );
}

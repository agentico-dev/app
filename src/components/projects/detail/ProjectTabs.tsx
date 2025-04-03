
import { FolderIcon, Server, Tool } from 'lucide-react';
import { ResourceTabs } from '../../detail/ResourceTabs';
import { Project } from '@/types/project';
import { OverviewTab, ApplicationsTab, ServersTab, ToolsTab } from './tabs';

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
          content: <OverviewTab description={project.description} projectId={project.id} />,
        },
        {
          value: 'applications',
          label: `Applications (${project.applications_count || 0})`,
          description: 'Applications associated with this project',
          icon: <FolderIcon className="h-4 w-4" />,
          content: <ApplicationsTab projectId={project.id} />,
        },
        {
          value: 'servers',
          label: `Servers (${project.servers_count || 0})`,
          description: 'Servers associated with this project',
          icon: <Server className="h-4 w-4" />,
          content: <ServersTab projectId={project.id} />,
        },
        {
          value: 'tools',
          label: `AI Tools (${project.tools_count || 0})`,
          description: 'AI tools for this project',
          icon: <Tool className="h-4 w-4" />,
          content: <ToolsTab projectId={project.id} />,
        },
      ]}
    />
  );
}

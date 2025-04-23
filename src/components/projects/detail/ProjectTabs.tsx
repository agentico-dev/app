
import { FolderIcon, Server, Wrench } from 'lucide-react';
import { ResourceTabs } from '../../detail/ResourceTabs';
import { Project } from '@/types/project';
import { OverviewTab, ApplicationsTab, ServersTab, ToolsTab } from './tabs';
import { useProjectServerDetails } from '@/hooks/useProjectServerDetails';

interface ProjectTabsProps {
  project: Project;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  const { serversWithTools } = useProjectServerDetails(project.id);
  const toolsCount = serversWithTools.reduce((acc, server) => acc + (server.tools ? server.tools.length : 0), 0);

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
          label: `Applications`,
          description: 'Applications associated with this project',
          icon: <FolderIcon className="h-4 w-4" />,
          content: <ApplicationsTab projectId={project.id} />,
        },
        {
          value: 'servers',
          label: `Servers`,
          description: 'Servers associated with this project',
          icon: <Server className="h-4 w-4" />,
          content: <ServersTab projectId={project.id} />,
        },
        {
          value: 'tools',
          label: `Tools`,
          description: 'Tools for this project',
          icon: <Wrench className="h-4 w-4" />,
          content: <ToolsTab projectId={project.id} />,
        },
      ]}
    />
  );
}


import { CircuitBoard, AppWindow, Server, Calendar, User } from 'lucide-react';
import { ResourceInfoCards } from '../../detail/ResourceInfoCards';
import { format } from 'date-fns';
import { Project } from '@/types/project';

interface ProjectResourceCardsProps {
  project: Project;
}

export function ProjectResourceCards({ project }: ProjectResourceCardsProps) {
  return (
    <ResourceInfoCards 
      cards={[
        {
          title: 'Resources',
          items: [
            {
              icon: <CircuitBoard className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'AI Tools',
              value: project.tools_count || 0,
            },
            {
              icon: <AppWindow className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Applications',
              value: project.applications_count || 0,
            },
            {
              icon: <Server className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Servers',
              value: project.servers_count || 0,
            },
          ],
        },
        {
          title: 'Created By',
          items: [
            {
              icon: <User className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: '',
              value: project.user_email || 'Unknown user',
            },
          ],
        },
        {
          title: 'Timeline',
          items: [
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Created:',
              value: project.created_at ? format(new Date(project.created_at), 'PPP') : 'Unknown',
            },
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Updated:',
              value: project.updated_at ? format(new Date(project.updated_at), 'PPP') : 'Unknown',
            },
          ],
        },
      ]}
    />
  );
}


import { CircuitBoard, AppWindow, Server as ServerIcon, Calendar, Tag } from 'lucide-react';
import { ResourceInfoCards } from '../../detail/ResourceInfoCards';
import { format } from 'date-fns';
import { Server } from '@/types/server';

interface ServerResourceCardsProps {
  server: Server;
}

export function ServerResourceCards({ server }: ServerResourceCardsProps) {
  return (
    <ResourceInfoCards 
      cards={[
        {
          title: 'Resources',
          items: [
            {
              icon: <CircuitBoard className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'AI Tools',
              value: 0,
            },
            {
              icon: <AppWindow className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Applications',
              value: 0,
            },
          ],
        },
        {
          title: 'Server Details',
          items: [
            {
              icon: <ServerIcon className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Type:',
              value: server.type,
            },
            {
              icon: <Tag className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Tags:',
              value: server.tags.length,
            },
          ],
        },
        {
          title: 'Timeline',
          items: [
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Created:',
              value: server.created_at ? format(new Date(server.created_at), 'PPP') : 'Unknown',
            },
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Updated:',
              value: server.updated_at ? format(new Date(server.updated_at), 'PPP') : 'Unknown',
            },
          ],
        },
      ]}
    />
  );
}

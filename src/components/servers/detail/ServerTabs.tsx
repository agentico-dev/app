
import { AppWindow, CircuitBoard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTabs } from '../../detail/ResourceTabs';
import { Server } from '@/types/server';

interface ServerTabsProps {
  server: Server;
}

export function ServerTabs({ server }: ServerTabsProps) {
  return (
    <ResourceTabs
      defaultTab="ai-tools"
      tabs={[
        {
          value: 'overview',
          label: 'Overview',
          description: 'Detailed information about this server',
          content: (
            <p className="text-muted-foreground">
              {server.description || 'No detailed description available for this server.'}
            </p>
          ),
        },
        {
          value: 'applications',
          label: 'Applications',
          description: 'Applications associated with this server',
          content: (
            <div className="text-center p-6">
              <AppWindow className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Applications</h3>
              <p className="text-muted-foreground mb-4">
                There are no applications associated with this server yet.
              </p>
              <Button>Deploy Application</Button>
            </div>
          ),
        },
        {
          value: 'ai-tools',
          label: 'AI Tools',
          description: 'AI tools deployed on this server',
          content: (
            <div className="text-center p-6">
              <CircuitBoard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No AI Tools</h3>
              <p className="text-muted-foreground mb-4">
                There are no AI tools deployed on this server yet.
              </p>
              <Button>Deploy AI Tool</Button>
            </div>
          ),
        },
        {
          value: 'logs',
          label: 'Logs',
          description: 'System logs and monitoring',
          content: (
            <div className="text-center p-6">
              <p className="text-muted-foreground">
                Log monitoring is not available for this server.
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}

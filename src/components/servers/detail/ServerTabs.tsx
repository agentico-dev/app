
import { FolderInput } from 'lucide-react';
import { ResourceTabs } from '../../detail/ResourceTabs';
import { Server } from '@/types/server';
import { ServerAIToolsTable } from './AIToolsTable';
import { useServerAITools } from '@/hooks/servers/useServerAITools';
import { toast } from 'sonner';

interface ServerTabsProps {
  server: Server;
}

export function ServerTabs({ server }: ServerTabsProps) {
  const { 
    aiTools, 
    availableTools, 
    associatedTools, 
    isLoading, 
    isOrganizationLevel,
    linkAITool,
    unlinkAITool
  } = useServerAITools(server.id, server.project_id);
  
  const handleAssociationToggle = async (toolId: string, associate: boolean) => {
    try {
      if (associate) {
        await linkAITool.mutateAsync({ serverId: server.id, aiToolId: toolId });
      } else {
        await unlinkAITool.mutateAsync({ serverId: server.id, aiToolId: toolId });
      }
    } catch (error) {
      console.error('Error toggling tool association:', error);
      toast.error('Failed to update tool association');
    }
  };

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
          value: 'ai-tools',
          label: `AI Tools (${aiTools?.length || 0})`,
          description: `AI tools associated to this server ${isOrganizationLevel ? 'at organization level' : 'at project level'}`,
          reference: isOrganizationLevel
            ? null
            : `/projects/${server.project_id}`,
          icon: <FolderInput className="h-4 w-4" />,
          content: (
            <ServerAIToolsTable
              availableTools={availableTools || []}
              associatedTools={associatedTools || []}
              isLoading={isLoading}
              onAssociateChange={handleAssociationToggle}
              isOrganizationLevel={isOrganizationLevel}
            />
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


import { ServerTreeView } from '../tree-view/ServerTreeView';
import { useProjectServerDetails } from '@/hooks/useProjectServerDetails';

interface OverviewTabProps {
  description: string | null;
  projectId: string;
}

export function OverviewTab({ description, projectId }: OverviewTabProps) {
  const { serversWithTools, isLoading } = useProjectServerDetails(projectId);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        {description || 'No detailed description available for this project.'}
      </p>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Project Resources</h3>
        <ServerTreeView 
          servers={serversWithTools} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

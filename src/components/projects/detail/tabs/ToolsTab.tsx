
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useProjectTools } from '@/hooks/projects/useProjectTools';
import { SharedAIToolsTable } from '@/components/shared/tools/AIToolsTable';

interface ToolsTabProps {
  projectId: string;
}

export function ToolsTab({ projectId }: ToolsTabProps) {
  const navigate = useNavigate();
  const { 
    availableTools, 
    associatedTools, 
    isLoading: isLoadingTools,
    hasAssociatedApplications,
    handleAssociationToggle
  } = useProjectTools(projectId);

  const handleCreateTool = () => {
    navigate('/tools/new', { state: { projectId } });
  };

  if (isLoadingTools) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If there are no associated applications, show an empty state
  if (!hasAssociatedApplications) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg bg-muted/10">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M18 16H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"/><path d="m10 10-2-2m0 0L6 6m2 2 2-2m4 2 2-2m0 0 2-2m-2 2-2-2"/></svg>
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">No tools available - associate applications with this project first</h3>
        <Button onClick={handleCreateTool} className="mt-4">
          Create AI Tool
        </Button>
      </div>
    );
  }

  // If there are no available tools for the associated applications
  if (availableTools.length === 0 && associatedTools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg bg-muted/10">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M18 16H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"/><path d="m10 10-2-2m0 0L6 6m2 2 2-2m4 2 2-2m0 0 2-2m-2 2-2-2"/></svg>
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">No tools available for the associated applications</h3>
        <Button onClick={handleCreateTool} className="mt-4">
          Create AI Tool
        </Button>
      </div>
    );
  }

  return (
    <SharedAIToolsTable
      availableTools={availableTools}
      associatedTools={associatedTools}
      isLoading={isLoadingTools}
      onAssociateChange={handleAssociationToggle}
      showBatchActions={true}
      emptyStateMessage="No tools available for this project."
    />
  );
}

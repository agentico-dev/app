
import { SharedAIToolsTable } from '@/components/shared/tools/AIToolsTable';
import { EnhancedAITool } from '@/types/ai-tool';
import { OrganizationLevelWarning } from './tools/OrganizationLevelWarning';

interface AIToolsTableProps {
  availableTools: EnhancedAITool[];
  associatedTools: EnhancedAITool[];
  isLoading: boolean;
  onAssociateChange: (toolId: string, associated: boolean) => Promise<void>;
  isOrganizationLevel?: boolean;
}

export function ServerAIToolsTable({ 
  availableTools, 
  associatedTools, 
  isLoading, 
  onAssociateChange,
  isOrganizationLevel = false
}: AIToolsTableProps) {
  return (
    <div className="space-y-4">
      <OrganizationLevelWarning isOrganizationLevel={isOrganizationLevel} />
      
      <SharedAIToolsTable
        availableTools={availableTools}
        associatedTools={associatedTools}
        isLoading={isLoading}
        onAssociateChange={onAssociateChange}
        showBatchActions={false}
        emptyStateMessage="No AI tools available."
        isOrganizationLevel={isOrganizationLevel}
      />
    </div>
  );
}

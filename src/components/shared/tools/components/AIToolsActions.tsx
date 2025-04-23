
import { Button } from '@/components/ui/button';
import { EnhancedAITool } from '@/types/ai-tool';

interface AIToolsActionsProps {
  toggleAllTools?: (associate: boolean) => Promise<void>;
  areAllToolsAssociated: boolean;
  isProcessingBatch: boolean;
  currentTools: EnhancedAITool[];
}

export function AIToolsActions({ 
  toggleAllTools, 
  areAllToolsAssociated,
  isProcessingBatch,
  currentTools
}: AIToolsActionsProps) {
  if (!toggleAllTools || currentTools.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="outline"
        onClick={() => toggleAllTools(!areAllToolsAssociated)}
        disabled={isProcessingBatch || currentTools.length === 0}
      >
        {areAllToolsAssociated ? 'Unlink All' : 'Link All'} Tools
      </Button>
    </div>
  );
}

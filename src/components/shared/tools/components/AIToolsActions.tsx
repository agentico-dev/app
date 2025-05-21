
import { Button } from '@/components/ui/button';
import { EnhancedAITool } from '@/types/ai-tool';
import { Link, Unlink } from 'lucide-react';

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
        {areAllToolsAssociated ? (
          <>
            <Unlink className="mr-1 h-4 w-4" />
            Unlink All Tools
          </>
        ) : (
          <>
            <Link className="mr-1 h-4 w-4" />
            Link All Tools
          </>
        )}
      </Button>
    </div>
  );
}

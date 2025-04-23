import React from 'react';
import { Table, TableBody, TableCaption } from '@/components/ui/table';
import { EnhancedAITool } from '@/types/ai-tool';
import { toast } from 'sonner';
import { useToolsTableState } from './hooks/useToolsTableState';

import {
  AIToolsSearch,
  AIToolsTableHeader,
  AIToolTableRow,
  PaginationControl,
  AIToolsLoadingState,
  AIToolsEmptyState
} from './components';

interface AIToolsTableProps {
  availableTools: EnhancedAITool[];
  associatedTools: EnhancedAITool[];
  isLoading: boolean;
  onAssociateChange: (toolId: string, associated: boolean) => Promise<void>;
  showBatchActions?: boolean;
  emptyStateMessage?: string;
  isOrganizationLevel?: boolean;
}

export function SharedAIToolsTable({ 
  availableTools, 
  associatedTools, 
  isLoading, 
  onAssociateChange,
  showBatchActions = true,
  emptyStateMessage = 'No tools available.',
  isOrganizationLevel = false
}: AIToolsTableProps) {
  // Combine available and associated tools
  const displayTools = [
    ...associatedTools.map(tool => ({...tool, associated: true})),
    ...availableTools.map(tool => ({...tool, associated: false}))
  ];

  const {
    searchTerm,
    setSearchTerm,
    currentTools,
    totalPages,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortField,
    sortDirection,
    handleSort,
    processingIds,
    setProcessingIds,
    isProcessingBatch,
    setIsProcessingBatch,
  } = useToolsTableState(displayTools);

  // Handle tool association change with processing state tracking
  const handleToolAssociationChange = async (toolId: string, associated: boolean) => {
    if (processingIds.has(toolId)) return;
    
    setProcessingIds(prev => new Set(prev).add(toolId));
    
    try {
      await onAssociateChange(toolId, associated);
    } catch (error) {
      console.error('Error updating tool association:', error);
      toast.error('Failed to update tool association');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }
  };

  // Handle toggle all tools on current page
  const handleToggleAllTools = async (associate: boolean) => {
    if (isProcessingBatch || currentTools.length === 0) return;
    
    const toolsToUpdate = currentTools.filter(tool => tool.associated !== associate);
    if (toolsToUpdate.length === 0) return;
    
    const toolIds = toolsToUpdate.map(tool => tool.id);
    setIsProcessingBatch(true);
    
    try {
      for (const toolId of toolIds) {
        await onAssociateChange(toolId, associate);
      }
    } catch (error) {
      console.error('Error batch updating tools:', error);
      toast.error('Failed to update some tool associations');
    } finally {
      setProcessingIds(new Set());
      setIsProcessingBatch(false);
    }
  };

  const areAllToolsAssociated = currentTools.length > 0 && currentTools.every(tool => tool.associated);
  const isIndeterminate = currentTools.length > 0 && 
                         currentTools.some(tool => tool.associated) && 
                         !areAllToolsAssociated;

  if (isLoading) {
    return <AIToolsLoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AIToolsSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {currentTools.length === 0 
              ? emptyStateMessage
              : `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, sortedTools.length)} of ${sortedTools.length} tools`}
          </TableCaption>
          
          <AIToolsTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            toggleAllTools={showBatchActions ? handleToggleAllTools : undefined}
            areAllToolsAssociated={areAllToolsAssociated}
            isIndeterminate={isIndeterminate}
            isUpdatingAll={isProcessingBatch}
          />
          
          <TableBody>
            {currentTools.length === 0 ? (
              <AIToolsEmptyState />
            ) : (
              currentTools.map((tool) => (
                <AIToolTableRow 
                  key={tool.id}
                  tool={tool}
                  onToggleAssociation={handleToolAssociationChange}
                  isUpdating={processingIds.has(tool.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
}

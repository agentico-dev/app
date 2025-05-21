
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
} from '@/components/ui/table';
import { EnhancedAITool } from '@/types/ai-tool';
import { toast } from 'sonner';

// Import our smaller components
import {
  AIToolsSearch,
  AIToolsTableHeader,
  AIToolTableRow,
  PaginationControl,
  AIToolsLoadingState,
  AIToolsEmptyState
} from './tools';

interface AIToolsTableProps {
  availableTools: EnhancedAITool[];
  associatedTools: EnhancedAITool[];
  isLoading: boolean;
  onAssociateChange: (toolId: string, associated: boolean) => Promise<void>;
}

export function AIToolsTable({ 
  availableTools, 
  associatedTools, 
  isLoading, 
  onAssociateChange 
}: AIToolsTableProps) {
  // State for tools after combining available and associated
  const [displayTools, setDisplayTools] = useState<EnhancedAITool[]>([]);
  
  // State for search, sorting, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EnhancedAITool | 'associated'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  
  // Update displayTools whenever availableTools or associatedTools change
  useEffect(() => {
    const combined = [
      ...associatedTools.map(tool => ({...tool, associated: true})),
      ...availableTools.map(tool => ({...tool, associated: false}))
    ];
    setDisplayTools(combined);
  }, [availableTools, associatedTools]);
  
  // Filter tools based on search term
  const filteredTools = displayTools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort tools based on sort field and direction
  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortField === 'associated') {
      return sortDirection === 'asc' 
        ? Number(a.associated) - Number(b.associated)
        : Number(b.associated) - Number(a.associated);
    }
    
    const aValue = a[sortField as keyof EnhancedAITool];
    const bValue = b[sortField as keyof EnhancedAITool];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  // Paginate tools
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTools = sortedTools.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTools.length / itemsPerPage);
  
  // Handle sort
  const handleSort = (field: keyof EnhancedAITool | 'associated') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle tool association change with processing state tracking
  const handleToolAssociationChange = async (toolId: string, associated: boolean) => {
    if (processingIds.has(toolId)) return;
    
    setProcessingIds(prev => new Set(prev).add(toolId));
    
    try {
      await onAssociateChange(toolId, associated);
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
    
    // Get tools that need to change state
    const toolsToUpdate = currentTools.filter(tool => tool.associated !== associate);
    if (toolsToUpdate.length === 0) return;
    
    const toolIds = toolsToUpdate.map(tool => tool.id);
    setIsProcessingBatch(true);
    
    try {
      // Mark all tools as processing
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        toolIds.forEach(id => newSet.add(id));
        return newSet;
      });
      
      // For current page, update UI immediately (optimistically)
      setDisplayTools(prev => 
        prev.map(tool => 
          currentTools.some(currentTool => currentTool.id === tool.id)
            ? { ...tool, associated: associate }
            : tool
        )
      );
      
      // Process in batch instead of one by one
      await Promise.all(toolIds.map(id => onAssociateChange(id, associate)));
      
    } catch (error) {
      console.error('Error updating tool associations:', error);
      toast.error('Failed to update some tool associations');
    } finally {
      // Clear processing state
      setProcessingIds(new Set());
      setIsProcessingBatch(false);
    }
  };
  
  // Check if all current tools have the same association state
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
            {sortedTools.length === 0 
              ? 'No tools available for this project or its applications.' 
              : `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, sortedTools.length)} of ${sortedTools.length} tools`}
          </TableCaption>
          
          <AIToolsTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            toggleAllTools={handleToggleAllTools}
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

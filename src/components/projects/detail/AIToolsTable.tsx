
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
} from '@/components/ui/table';
import { EnhancedAITool } from '@/types/ai-tool';
import { toast } from 'sonner';

// Import our new smaller components
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
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Update displayTools whenever availableTools or associatedTools change
  useEffect(() => {
    const combined = [
      ...availableTools.map(tool => ({...tool, associated: false})), 
      ...associatedTools.map(tool => ({...tool, associated: true}))
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

  // Handle tool association change
  const handleToolAssociationChange = async (toolId: string, associated: boolean) => {
    setIsUpdating(true);
    try {
      await onAssociateChange(toolId, associated);
      
      // Update the display tools optimistically
      setDisplayTools(prevTools => 
        prevTools.map(tool => 
          tool.id === toolId ? { ...tool, associated } : tool
        )
      );
      
      toast.success(`Tool ${associated ? 'associated' : 'disassociated'} successfully`);
    } catch (error) {
      toast.error('Failed to update tool association');
      console.error('Error updating tool association:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
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
                  isUpdating={isUpdating}
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

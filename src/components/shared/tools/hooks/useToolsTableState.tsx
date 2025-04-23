
import { useState, useEffect } from 'react';
import { EnhancedAITool } from '@/types/ai-tool';

export function useToolsTableState(initialTools: EnhancedAITool[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EnhancedAITool | 'associated'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [localTools, setLocalTools] = useState<EnhancedAITool[]>(initialTools);
  
  // Update local tools when props change
  useEffect(() => {
    setLocalTools(initialTools);
  }, [initialTools]);

  // Filter tools based on search term
  const filteredTools = localTools.filter(tool => 
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

  return {
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
    setLocalTools,
  };
}

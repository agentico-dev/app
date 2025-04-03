
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { EnhancedAITool } from '@/types/ai-tool';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
  
  // Generate page numbers for pagination
  const getPageRange = () => {
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSide = Math.floor(maxPagesToShow / 2);
    const rightSide = maxPagesToShow - leftSide - 1;
    
    if (currentPage > totalPages - rightSide) {
      return Array.from({ length: maxPagesToShow }, (_, i) => totalPages - maxPagesToShow + i + 1);
    }
    
    if (currentPage < leftSide + 1) {
      return Array.from({ length: maxPagesToShow }, (_, i) => i + 1);
    }
    
    return Array.from({ length: maxPagesToShow }, (_, i) => currentPage - leftSide + i);
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tools by name or description..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {sortedTools.length === 0 
              ? 'No tools available for this project or its applications.' 
              : `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, sortedTools.length)} of ${sortedTools.length} tools`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => handleSort('associated')}
                >
                  Associated
                  {sortField === 'associated' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => handleSort('name')}
                >
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Related Services</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tools found.
                </TableCell>
              </TableRow>
            ) : (
              currentTools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    <Switch
                      checked={tool.associated}
                      onCheckedChange={(checked) => handleToolAssociationChange(tool.id, checked)}
                      disabled={isUpdating}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>{tool.description || 'No description'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(tool.status)}`}
                    >
                      {tool.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {tool.application_service && (
                        <div className="text-sm">
                          <span className="font-medium">Service:</span>{' '}
                          {tool.application_service.name}
                        </div>
                      )}
                      {tool.application_api && (
                        <div className="text-sm">
                          <span className="font-medium">API:</span>{' '}
                          <Link 
                            to={`/applications/${tool.application?.id}/apis/${tool.application_api.id}`}
                            className="text-primary hover:underline"
                          >
                            {tool.application_api.name} {tool.application_api.version}
                          </Link>
                        </div>
                      )}
                      {tool.application && (
                        <div className="text-sm">
                          <span className="font-medium">Application:</span>{' '}
                          <Link 
                            to={`/applications/${tool.application.slug}`}
                            className="text-primary hover:underline"
                          >
                            {tool.application.name}
                          </Link>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="itemsPerPage">Items per page:</Label>
          <select
            id="itemsPerPage"
            className="border rounded p-1"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageRange().map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

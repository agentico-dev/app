
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { EnhancedAITool } from '@/types/ai-tool';
import { AIToolsSearch } from './tools/AIToolsSearch';
import { AIToolsTableHeader } from './tools/AIToolsTableHeader';
import { AIToolTableRow } from './tools/AIToolTableRow';
import { OrganizationLevelWarning } from './tools/OrganizationLevelWarning';
import { AIToolsEmptyState } from './tools/AIToolsEmptyState';
import { AIToolsLoadingState } from './tools/AIToolsLoadingState';

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
  const { toast } = useToast();
  
  // Combine available and associated tools
  const allTools = [
    ...availableTools.map(tool => ({...tool, associated: false})), 
    ...associatedTools.map(tool => ({...tool, associated: true}))
  ];
  
  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EnhancedAITool | 'associated'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter tools based on search term
  const filteredTools = allTools.filter(tool => 
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
  
  // Handle sort
  const handleSort = (field: keyof EnhancedAITool | 'associated') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  if (isLoading) {
    return <AIToolsLoadingState />;
  }
  
  return (
    <div className="space-y-4">
      <OrganizationLevelWarning isOrganizationLevel={isOrganizationLevel} />
      
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
              ? 'No AI tools available.' 
              : `Showing ${sortedTools.length} AI tools`}
          </TableCaption>
          
          <AIToolsTableHeader 
            sortField={sortField} 
            sortDirection={sortDirection} 
            onSort={handleSort} 
          />
          
          <TableBody>
            {sortedTools.length === 0 ? (
              <AIToolsEmptyState />
            ) : (
              sortedTools.map((tool) => (
                <AIToolTableRow 
                  key={tool.id} 
                  tool={tool} 
                  onAssociateChange={onAssociateChange} 
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

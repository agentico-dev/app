
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router';
import { EnhancedAITool } from '@/types/ai-tool';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
      {isOrganizationLevel && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4 rounded">
          <p className="font-medium">Tools listed are at organization level.</p>
          <p className="text-sm">Associate this server with a project to see project-specific tools.</p>
        </div>
      )}
      
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
              ? 'No AI tools available.' 
              : `Showing ${sortedTools.length} AI tools`}
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
            {sortedTools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tools found.
                </TableCell>
              </TableRow>
            ) : (
              sortedTools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    <Switch
                      checked={tool.associated}
                      onCheckedChange={(checked) => onAssociateChange(tool.id, checked)}
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
    </div>
  );
}

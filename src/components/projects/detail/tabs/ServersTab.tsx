
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useProjectServers } from '@/hooks/useProjectServers';
import { useServers } from '@/hooks/servers/useServers';
import { ServersTable } from '../ServersTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Upload, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CreateServerForm } from '../CreateServerForm';
import { Server } from '@/types/server';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ServersTabProps {
  projectId: string;
}

export function ServersTab({ projectId }: ServersTabProps) {
  const navigate = useNavigate();
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Fetch all servers and project servers
  const { servers, isLoading: isLoadingAllServers } = useServers();
  
  const {
    associatedServers,
    isLoadingAssociatedServers,
    associateServer,
    disassociateServer
  } = useProjectServers(projectId);
  
  // Create a map of server IDs that are associated with the project
  const associatedServerIds = useMemo(() => {
    if (!associatedServers) return new Set<string>();
    return new Set(associatedServers.map(item => item.server_id));
  }, [associatedServers]);

  // Filter and sort servers
  const filteredServers = useMemo(() => {
    if (!servers) return [];
    
    return servers.filter(server => {
      const matchesSearch = !searchQuery || 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.description && server.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
  }, [servers, searchQuery]);

  // Sort servers
  const sortedServers = useMemo(() => {
    if (!filteredServers) return [];

    return [...filteredServers].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'type') {
        comparison = (a.type || '').localeCompare(b.type || '');
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredServers, sortField, sortDirection]);

  // Paginate servers
  const paginatedServers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedServers.slice(startIndex, startIndex + pageSize);
  }, [sortedServers, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedServers.length / pageSize);

  // Handle server association toggle
  const handleAssociationToggle = async (serverId: string, isAssociated: boolean) => {
    if (isAssociated) {
      await disassociateServer.mutateAsync({ serverId });
    } else {
      await associateServer.mutateAsync({ serverId });
    }
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLoading = isLoadingAssociatedServers || isLoadingAllServers;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Servers</h3>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsAddServerOpen(true)} 
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Insert
          </Button>
          <Button 
            onClick={() => setIsImportOpen(true)} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            Import from CSV
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search servers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Display servers in a table */}
      <ServersTable
        servers={paginatedServers}
        associatedServerIds={associatedServerIds}
        isLoading={isLoading}
        projectId={projectId}
        onAssociationToggle={handleAssociationToggle}
        onSort={handleSortChange}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {/* Pagination */}
      {!isLoading && sortedServers.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add Server Sheet */}
      <Sheet open={isAddServerOpen} onOpenChange={setIsAddServerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-5">
            <SheetTitle>Add Server to Project</SheetTitle>
            <SheetDescription>
              Create a new server and automatically associate it with this project.
            </SheetDescription>
          </SheetHeader>
          <CreateServerForm 
            projectId={projectId} 
            onSuccess={() => setIsAddServerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Import CSV Sheet - Placeholder for now */}
      <Sheet open={isImportOpen} onOpenChange={setIsImportOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Import Servers from CSV</SheetTitle>
            <SheetDescription>
              Upload a CSV file to import multiple servers at once.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <p className="text-muted-foreground">
              CSV import functionality is not yet implemented. Please check back later.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

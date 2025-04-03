
import { Server } from "@/types/server";
import { Server as ServerIcon, ExternalLink, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ServersTableProps {
  servers: Server[];
  associatedServerIds: Set<string>;
  isLoading: boolean;
  projectId?: string;
  onAssociationToggle?: (serverId: string, isAssociated: boolean) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export function ServersTable({ 
  servers, 
  associatedServerIds,
  isLoading, 
  projectId,
  onAssociationToggle,
  onSort,
  sortField = 'name',
  sortDirection = 'asc'
}: ServersTableProps) {
  const navigate = useNavigate();

  const handleServerClick = (serverId: string) => {
    navigate(`/servers/${serverId}`);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleSortClick = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!servers || servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg bg-muted/10">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <ServerIcon className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">No servers found</h3>
        <p className="text-muted-foreground mb-4">Try changing your search criteria or create a new server</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSortClick('name')}
          >
            <div className="flex items-center">
              Name {renderSortIcon('name')}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSortClick('status')}
          >
            <div className="flex items-center">
              Status {renderSortIcon('status')}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSortClick('type')}
          >
            <div className="flex items-center">
              Type {renderSortIcon('type')}
            </div>
          </TableHead>
          {projectId && (
            <TableHead className="text-center">Associate</TableHead>
          )}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servers.map((server) => {
          const isAssociated = associatedServerIds?.has(server.id) || false;
          
          return (
            <TableRow 
              key={server.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleServerClick(server.id)}
            >
              <TableCell className="font-medium flex items-center gap-2">
                <ServerIcon className="h-4 w-4 text-muted-foreground" />
                {server.name}
                {server.favorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    server.status === 'active' ? 'bg-green-500' : 
                    server.status === 'suspended' ? 'bg-yellow-500' : 
                    server.status === 'offline' ? 'bg-gray-500' :
                    server.status === 'development' ? 'bg-blue-500' : 
                    'bg-gray-500'
                  }`}></div>
                  <span className="capitalize">{server.status}</span>
                </div>
              </TableCell>
              <TableCell>{server.type || 'Standard'}</TableCell>
              {projectId && (
                <TableCell className="text-center">
                  <Switch
                    checked={isAssociated}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAssociationToggle) {
                        onAssociationToggle(server.id, isAssociated);
                      }
                    }}
                  />
                </TableCell>
              )}
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/servers/${server.id}`);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )}
        )}
      </TableBody>
    </Table>
  );
}

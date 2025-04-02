
import { Server } from "@/types/server";
import { Server as ServerIcon, ExternalLink, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

interface ServersTableProps {
  servers: Server[];
  isLoading: boolean;
}

export function ServersTable({ servers, isLoading }: ServersTableProps) {
  const navigate = useNavigate();

  const handleServerClick = (serverId: string) => {
    navigate(`/servers/${serverId}`);
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
        <h3 className="text-lg font-medium mt-4 mb-2">No servers associated with this project</h3>
        <p className="text-muted-foreground mb-4">Add servers to enhance your project infrastructure</p>
        <Button onClick={() => navigate('/servers/new')}>
          Create Server
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servers.map((server) => (
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
                  server.status === 'maintenance' ? 'bg-yellow-500' : 
                  server.status === 'development' ? 'bg-blue-500' : 
                  'bg-gray-500'
                }`}></div>
                <span className="capitalize">{server.status}</span>
              </div>
            </TableCell>
            <TableCell>{server.type || 'Standard'}</TableCell>
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
        ))}
      </TableBody>
    </Table>
  );
}

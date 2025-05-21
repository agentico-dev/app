
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Server } from '@/types/server';
import { ServerTreeItem } from './ServerTreeItem';
import { EnhancedAITool } from '@/types/ai-tool';
import { Search, ServerIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ServerWithTools extends Server {
  tools?: EnhancedAITool[];
}

interface ServerTreeViewProps {
  servers: ServerWithTools[];
  isLoading: boolean;
}

export function ServerTreeView({ servers, isLoading }: ServerTreeViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter servers based on search term
  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (server.description && server.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative w-full mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search servers..."
            className="pl-8"
            disabled
          />
        </div>
        <div className="w-full border rounded-md p-2">
          <div className="grid grid-cols-12 p-2 font-medium text-sm border-b">
            <div className="col-span-4">Name</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Type</div>
          </div>
          {[1, 2, 3].map(i => (
            <ServerTreeItemSkeleton key={i} />
          ))}
        </div>
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
        <p className="text-muted-foreground">Add servers to this project to visualize them here</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search servers..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div 
        className="w-full border rounded-md p-2"
        role="treegrid"
        aria-label="Project Servers"
      >
        {/* Header row */}
        <div className="grid grid-cols-12 p-2 font-medium text-sm border-b" role="row">
          <div className="col-span-4" role="columnheader">Name</div>
          <div className="col-span-4" role="columnheader">Description</div>
          <div className="col-span-2" role="columnheader">Status</div>
          <div className="col-span-2" role="columnheader">Type</div>
        </div>

        {/* Tree items */}
        {filteredServers.length > 0 ? (
          <div role="rowgroup">
            {filteredServers.map(server => (
              <ServerTreeItem 
                key={server.id}
                server={server}
                tools={server.tools || []}
                isLoading={false}
                expanded={true}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No servers match your search criteria
          </div>
        )}
      </div>
    </div>
  );
}

function ServerTreeItemSkeleton() {
  return (
    <div className="w-full p-2" role="row">
      <div className="flex items-center">
        <Skeleton className="h-4 w-4 mr-2" />
        <div className="grid grid-cols-12 flex-grow gap-2">
          <div className="col-span-4">
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="col-span-4">
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

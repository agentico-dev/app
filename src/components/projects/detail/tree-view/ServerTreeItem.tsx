
import { useState } from 'react';
import { Link } from 'react-router';
import { Server } from '@/types/server';
import { EnhancedAITool } from '@/types/ai-tool';
import { ChevronRight, ChevronDown, Server as ServerIcon, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ServerTreeItemProps {
  server: Server;
  tools: EnhancedAITool[];
  isLoading: boolean;
  level?: number;
  expanded?: boolean;
}

export function ServerTreeItem({
  server,
  tools,
  isLoading,
  level = 0,
  expanded = false
}: ServerTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  // Truncate description text
  const truncateText = (text: string, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active': return 'bg-green-500';
      case 'development': return 'bg-blue-500';
      case 'suspended': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (isLoading) {
    return <ServerTreeItemSkeleton level={level} />;
  }

  return (
    <div className="w-full" role="row">
      <div 
        className={cn(
          "flex items-center w-full p-2 hover:bg-muted/50 rounded-md",
          level === 0 ? "font-medium" : ""
        )}
      >
        <div 
          className="flex items-center justify-center w-6 h-6 cursor-pointer" 
          onClick={toggleExpand}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {tools.length > 0 ? (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="w-4" />
          )}
        </div>
        
        <div className="grid grid-cols-12 flex-grow gap-2 items-center">
          <div className="flex items-center gap-2 col-span-4">
            <ServerIcon className="h-4 w-4 text-muted-foreground" />
            <Link 
              to={`/servers/${server.id}`} 
              className="hover:underline truncate"
            >
              {server.name}
            </Link>
          </div>
          <div className="col-span-4 text-muted-foreground truncate">
            {truncateText(server.description)}
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColorClass(server.status)}`}></div>
              <span className="capitalize">{server.status}</span>
            </div>
          </div>
          <div className="col-span-2 text-muted-foreground">
            {server.type || 'Standard'}
          </div>
        </div>
      </div>

      {isExpanded && tools.length > 0 && (
        <div className="pl-6 border-l border-muted ml-3 mt-1 mb-2" role="rowgroup">
          <div className="text-sm text-muted-foreground font-medium p-2">
            Associated Tools ({tools.length})
          </div>
          
          {tools.map(tool => (
            <div key={tool.id} className="flex items-center p-2 hover:bg-muted/50 rounded-md" role="row">
              <div className="w-6"></div>
              <div className="grid grid-cols-12 flex-grow gap-2 items-center">
                <div className="flex items-center gap-2 col-span-4">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <Link 
                    to={`/tools/${tool.id}`} 
                    className="hover:underline truncate"
                  >
                    {tool.name}
                  </Link>
                </div>
                <div className="col-span-4 text-muted-foreground truncate">
                  {truncateText(tool.description)}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tool.status === 'active' ? 'bg-green-500' : 
                      tool.status === 'development' ? 'bg-blue-500' : 
                      tool.status === 'maintenance' ? 'bg-yellow-500' : 
                      tool.status === 'archived' ? 'bg-gray-500' : 
                      'bg-gray-400'
                    }`}></div>
                    <span className="capitalize">{tool.status}</span>
                  </div>
                </div>
                <div className="col-span-2 text-muted-foreground">
                  {tool.application_service?.name || '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ServerTreeItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div className="w-full">
      <div className={cn(
        "flex items-center w-full p-2",
        level === 0 ? "font-medium" : ""
      )}>
        <div className="w-6 mr-2">
          <Skeleton className="h-4 w-4" />
        </div>
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


import React from 'react';
import { Server as ServerType } from '@/types/server';
import ServerCard from './ServerCard';
import ServerSkeleton from './ServerSkeleton';
import EmptyServerState from './EmptyServerState';
import { Tag } from '@/types/application';

interface ServersListProps {
  servers: ServerType[];
  filteredServers: ServerType[];
  isLoading: boolean;
  toggleFavorite: (id: string, currentState: boolean) => Promise<void>;
  tags: Tag[];
  searchValue: string;
  selectedStatus: string | null;
  selectedTags: string[];
}

export function ServersList({ 
  servers, 
  filteredServers, 
  isLoading, 
  toggleFavorite,
  tags,
  searchValue,
  selectedStatus,
  selectedTags
}: ServersListProps) {
  if (isLoading) {
    return <ServerSkeleton />;
  }

  const isFiltered = searchValue !== '' || selectedStatus !== null || selectedTags.length > 0;
  const hasServers = servers && servers.length > 0;

  if (filteredServers.length === 0) {
    return <EmptyServerState 
      hasServers={hasServers} 
      isFiltered={isFiltered} 
      searchQuery={searchValue}
    />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServers.map((server) => (
        <ServerCard 
          key={server.id} 
          server={server} 
          onToggleFavorite={toggleFavorite}
          tags={tags}
        />
      ))}
    </div>
  );
}

export default ServersList;

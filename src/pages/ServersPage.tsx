
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Server, Star, StarIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useServers } from '@/hooks/useServers';
import { TagBadge } from '@/components/applications/TagBadge';
import { Server as ServerType } from '@/types/server';
import { FilterControls } from '@/components/applications/FilterControls';
import { useTags } from '@/contexts/TagsContext';

// Define custom filter controls interface to match component props
interface CustomFilterControlsProps {
  searchValue: string; 
  onSearchValueChange: (value: string) => void;
  statusOptions: { label: string; value: string | null }[];
  selectedStatus: string | null;
  onStatusChange: (value: string | null) => void;
  tags: { id: string; name: string }[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const statusColors = {
  'active': 'bg-green-500',
  'inactive': 'bg-red-500',
  'maintenance': 'bg-yellow-500',
  'development': 'bg-blue-500',
  'deprecated': 'bg-gray-500',
  'planning': 'bg-purple-500',
};

function ServersPage() {
  const navigate = useNavigate();
  const { servers, isLoading, error, toggleFavorite } = useServers();
  const { tags, isLoading: tagsLoading } = useTags();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Filter the servers based on search, status, and tags
  const filteredServers = (servers || []).filter((server) => {
    const matchesSearch = search === '' || 
      server.name.toLowerCase().includes(search.toLowerCase()) ||
      (server.description?.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = selectedStatus === null || 
      server.status.toLowerCase() === selectedStatus.toLowerCase();
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => server.tags.includes(tag));
    
    return matchesSearch && matchesStatus && matchesTags;
  });

  const handleToggleFavorite = async (id: string, currentState: boolean) => {
    try {
      await toggleFavorite.mutateAsync({ id, favorite: !currentState });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Development', value: 'development' },
    { label: 'Deprecated', value: 'deprecated' },
    { label: 'Planning', value: 'planning' },
  ];

  if (isLoading || tagsLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Servers</h1>
          <Button onClick={() => navigate('/servers/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Server
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted" />
              <CardContent className="py-4">
                <div className="h-5 bg-muted rounded mb-2 w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading the servers. Please try again later.</p>
            <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Servers</h1>
        <Button onClick={() => navigate('/servers/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Server
        </Button>
      </div>

      <FilterControls
        searchValue={search}
        onSearchValueChange={setSearch}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        tags={tags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />

      {filteredServers.length === 0 ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl">No Servers Found</CardTitle>
            <CardDescription>
              {servers && servers.length > 0
                ? "No servers match your current filters. Try changing your search criteria."
                : "You haven't created any servers yet. Click 'New Server' to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Server className="h-16 w-16 text-muted-foreground mb-4" />
            <Button onClick={() => navigate('/servers/new')} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Server
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server: ServerType) => (
            <Card key={server.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          statusColors[server.status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-500'
                        }`}
                      />
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(server.id, server.favorite);
                      }}
                      className="text-muted-foreground hover:text-yellow-400 transition-colors"
                    >
                      {server.favorite ? (
                        <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {server.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <div className="flex items-center mr-4">
                      <Server className="h-4 w-4 mr-1" />
                      <span>{server.type}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {server.tags.slice(0, 3).map((tagId) => (
                      <TagBadge 
                        key={tagId} 
                        name={tags.find(tag => tag.id === tagId)?.name || 'Unknown'} 
                      />
                    ))}
                    {server.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{server.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground">
                  Created {new Date(server.created_at).toLocaleDateString()}
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServersPage;

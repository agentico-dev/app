
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useServers } from '@/hooks/useServers';
import { FilterControls } from '@/components/applications/FilterControls';
import { useTags } from '@/contexts/TagsContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ServersList from '@/components/servers/ServersList';

function ServersPage() {
  const navigate = useNavigate();
  const { servers, isLoading, error, toggleFavorite } = useServers();
  const { tags, isLoading: tagsLoading } = useTags();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
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

      <ServersList 
        servers={servers || []}
        filteredServers={filteredServers}
        isLoading={isLoading || tagsLoading}
        toggleFavorite={handleToggleFavorite}
        tags={tags}
        searchValue={search}
        selectedStatus={selectedStatus}
        selectedTags={selectedTags}
      />
    </div>
  );
}

export default ServersPage;

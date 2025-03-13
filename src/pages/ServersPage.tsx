
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Plus, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ApplicationStatus } from '@/types/application';
import { Server } from '@/types/server';
import { FilterControls } from '@/components/applications/FilterControls';
import { ApplicationsTabContent } from '@/components/applications/ApplicationsTabContent';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from '@/components/applications/EmptyStates';

export function ServersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { session } = useAuth();
  const isAuthenticated = !!session.user;

  // Query to fetch servers from Supabase
  const { data: servers = [], isLoading, error } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        return data.map((server): Server => ({
          id: server.id,
          name: server.name,
          description: server.description || '',
          type: server.type || 'Standard',
          status: (server.status || 'active').toLowerCase() as ApplicationStatus,
          favorite: server.favorite || false,
          organization_id: server.organization_id,
          tags: server.tags || [],
          created_at: server.created_at || new Date().toISOString(),
          updated_at: server.updated_at || new Date().toISOString()
        }));
      } catch (err) {
        console.error('Unexpected error fetching servers:', err);
        toast({
          title: 'Unexpected error',
          description: 'Failed to load servers. Please try again later.',
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: isAuthenticated
  });

  // Filter servers based on search query and active filter
  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          server.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && server.favorite;
    if (activeFilter === 'active') return matchesSearch && server.status === 'active';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Servers</h2>
          <p className="text-muted-foreground">
            Manage your server resources and environments
          </p>
        </div>
        <Button asChild>
          <Link to={isAuthenticated ? "/servers/new" : "/login"}>
            <Plus className="mr-2 h-4 w-4" />
            New Server
          </Link>
        </Button>
      </div>
      
      {!isAuthenticated && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertDescription>
            You are currently in limited access mode. Some features may be restricted.
          </AlertDescription>
        </Alert>
      )}

      <FilterControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        applications={servers}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Servers</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <EmptyState type="loading" />
          ) : error ? (
            <EmptyState type="error" />
          ) : servers.length === 0 ? (
            <EmptyState type="no-applications" />
          ) : filteredServers.length === 0 ? (
            <div className="flex justify-center p-8">
              <p className="text-muted-foreground">No servers match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServers.map(server => (
                <div key={server.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{server.name}</h3>
                  <p className="text-sm text-muted-foreground">{server.description}</p>
                  <div className="flex mt-2 gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">
                      {server.type}
                    </span>
                    <span className={`text-xs rounded px-2 py-1 ${
                      server.status === 'active' ? 'bg-green-100 text-green-800' : 
                      server.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {server.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          {isLoading ? (
            <EmptyState type="loading" />
          ) : filteredServers.filter(s => s.favorite).length === 0 ? (
            <EmptyState type="no-favorites" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServers
                .filter(server => server.favorite)
                .map(server => (
                  <div key={server.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{server.name}</h3>
                    <p className="text-sm text-muted-foreground">{server.description}</p>
                    <div className="flex mt-2 gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">
                        {server.type}
                      </span>
                      <span className={`text-xs rounded px-2 py-1 ${
                        server.status === 'active' ? 'bg-green-100 text-green-800' : 
                        server.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {server.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          {isLoading ? (
            <EmptyState type="loading" />
          ) : servers.length === 0 ? (
            <EmptyState type="no-applications" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...filteredServers]
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .slice(0, 6)
                .map(server => (
                  <div key={server.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{server.name}</h3>
                    <p className="text-sm text-muted-foreground">{server.description}</p>
                    <div className="flex mt-2 gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">
                        {server.type}
                      </span>
                      <span className={`text-xs rounded px-2 py-1 ${
                        server.status === 'active' ? 'bg-green-100 text-green-800' : 
                        server.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {server.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ServersPage;

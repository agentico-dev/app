
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Plus, Shield, Server, Database } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Server {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  favorite: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export function ServersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { session } = useAuth();
  const isAuthenticated = !!session.user;

  // Query to fetch servers
  const { data: servers = [], isLoading } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching servers:', err);
        toast({
          title: 'Failed to load servers',
          description: err instanceof Error ? err.message : 'An unexpected error occurred',
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  // Filter servers based on search query and active filter
  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (server.description && server.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && server.favorite;
    if (activeFilter === 'active') return matchesSearch && server.status === 'Active';
    if (activeFilter === 'offline') return matchesSearch && server.status === 'Offline';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Servers</h2>
          <p className="text-muted-foreground">
            Manage your infrastructure for AI applications
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
            You're browsing in read-only mode. Sign in to create or manage servers.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search servers..."
            className="pl-8 w-full md:max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveFilter(null)}>
              All Servers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('favorite')}>
              Favorites
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('active')}>
              Active Servers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('offline')}>
              Offline Servers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Servers</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredServers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Server className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No servers found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {searchQuery 
                  ? "No servers match your search criteria. Try adjusting your filters."
                  : "There are no servers available yet. Create your first server to get started."}
              </p>
              {isAuthenticated && (
                <Button asChild>
                  <Link to="/servers/new">Create Server</Link>
                </Button>
              )}
            </Card>
          )}
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="p-4">
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredServers.filter(p => p.favorite).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServers.filter(p => p.favorite).map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorite servers</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                You haven't marked any servers as favorites yet.
              </p>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="p-4">
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredServers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServers.slice(0, 3).map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Server className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recent servers</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                There are no recent servers to display.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Missing import
import { Search, Star } from 'lucide-react';

function ServerCard({ server }: { server: Server }) {
  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{server.name}</CardTitle>
            {server.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {server.description || 'No description available'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {server.tags && server.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{server.type}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`
          ${server.status === 'Active' ? 'tag-green' : ''}
          ${server.status === 'Maintenance' ? 'tag-yellow' : ''}
          ${server.status === 'Offline' ? 'tag-red' : ''}
        `}>
          {server.status}
        </Badge>
        <Button asChild>
          <Link to={`/servers/${server.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ServersPage;

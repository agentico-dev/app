
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { AppWindow, CircuitBoard, Filter, Plus, Search, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Application, ApplicationStatus } from '@/types/application';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Query to fetch applications from Supabase
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('api.applications')
          .select('*');

        if (error) {
          console.error('Error fetching applications:', error);
          toast({
            title: 'Error fetching applications',
            description: error.message,
            variant: 'destructive',
          });
          return [];
        }

        // Format data to match the Application interface
        return data.map((app) => ({
          id: app.id,
          name: app.name,
          description: app.description || '',
          category: app.category || 'Other',
          status: (app.status || 'active').toLowerCase() as ApplicationStatus,
          favorite: app.favorite || false,
          endpoints_count: app.endpoints_count || 0,
          tools_count: app.tools_count || 0,
          tags: app.tags || [],
          created_at: app.created_at,
          updated_at: app.updated_at
        }));
      } catch (err) {
        console.error('Unexpected error fetching applications:', err);
        toast({
          title: 'Unexpected error',
          description: 'Failed to load applications. Please try again later.',
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  // Filter applications based on search query and active filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && app.favorite;
    if (activeFilter === 'active') return matchesSearch && app.status === 'active';
    if (activeFilter === 'category') return matchesSearch && app.category === activeFilter;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Manage your external API interfaces and applications
          </p>
        </div>
        <Button asChild>
          <Link to="/applications/new">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
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
              All Applications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('favorite')}>
              Favorites
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            {/* Dynamically generate category filters from unique categories */}
            {[...new Set(applications.map(app => app.category))].map(category => (
              <DropdownMenuItem key={category} onClick={() => setActiveFilter(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading applications...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center p-8">
              <p className="text-red-500">Failed to load applications</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="mb-4 text-muted-foreground">No applications found</p>
              <Button asChild>
                <Link to="/applications/new">Create your first application</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading applications...</p>
            </div>
          ) : filteredApplications.filter(a => a.favorite).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="mb-4 text-muted-foreground">No favorite applications found</p>
              <p className="text-sm text-muted-foreground">Mark applications as favorites to see them here</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredApplications.filter(a => a.favorite).map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="mb-4 text-muted-foreground">No recent applications found</p>
              <Button asChild>
                <Link to="/applications/new">Create your first application</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Show most recently updated applications first */}
              {[...filteredApplications]
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .slice(0, 6)
                .map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const getStatusClassName = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'development': return 'bg-purple-500 hover:bg-purple-600';
      case 'maintenance': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'archived': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{application.name}</CardTitle>
            {application.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {application.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {application.category}
          </Badge>
          {application.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.endpoints_count} endpoints</span>
          </div>
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.tools_count} AI tools</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`${getStatusClassName(application.status)} text-white`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
        <Button asChild>
          <Link to={`/applications/${application.id}`}>View API</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ApplicationsPage;

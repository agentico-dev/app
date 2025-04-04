
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppWindow, CircuitBoard, Filter, Plus, Search, Shield, Star } from 'lucide-react';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AITool {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  status: string | null;
  favorite: boolean | null;
  applications_count: number | null;
  agents_count: number | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export function AIToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { session } = useAuth();
  const isAuthenticated = !!session.user;

  // Query to fetch AI tools from Supabase
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['ai-tools'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ai_tools')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as AITool[];
      } catch (err) {
        console.error('Error fetching AI tools:', err);
        toast({
          title: 'Failed to load AI tools',
          description: err instanceof Error ? err.message : 'An unexpected error occurred',
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  // Filter tools based on search query and active filter
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && tool.favorite;
    if (activeFilter === 'active') return matchesSearch && tool.status === 'active';
    if (activeFilter === 'category') return matchesSearch && tool.category === activeFilter;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">AI Tools</h2>
          <p className="text-muted-foreground">
            Manage your AI tools and integrations
          </p>
        </div>
        <Button asChild>
          <Link to={isAuthenticated ? "/ai-tools/new" : "/login"}>
            <Plus className="mr-2 h-4 w-4" />
            New AI Tool
          </Link>
        </Button>
      </div>

      {!isAuthenticated && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertDescription>
            You're browsing in read-only mode. Sign in to create or manage AI tools.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search AI tools..."
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
              All AI Tools
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('favorite')}>
              Favorites
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('development')}>
              In Development
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
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
          ) : filteredTools.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <AIToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <CircuitBoard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No AI tools found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {searchQuery 
                  ? "No AI tools match your search criteria. Try adjusting your filters."
                  : "There are no AI tools available yet. Create your first AI tool to get started."}
              </p>
              {isAuthenticated && (
                <Button asChild>
                  <Link to={isAuthenticated ? "/ai-tools/new" : "/login"}>Create AI Tool</Link>
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
          ) : filteredTools.filter(t => t.favorite).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.filter(t => t.favorite).map((tool) => (
                <AIToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorite AI tools</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                You haven't marked any AI tools as favorites yet.
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
          ) : filteredTools.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.slice(0, 3).map((tool) => (
                <AIToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <CircuitBoard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recent AI tools</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                There are no recent AI tools to display.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AIToolCard({ tool }: { tool: AITool }) {
  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{tool.name}</CardTitle>
          {tool.favorite && (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        <CardDescription className="mt-1">
          {tool.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags && tool.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1" />
            <span>{tool.applications_count || 0} apps</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`
          ${tool.status === 'active' ? 'tag-green' : ''}
          ${tool.status === 'development' ? 'tag-purple' : ''}
          ${tool.status === 'maintenance' ? 'tag-yellow' : ''}
          ${tool.status === 'archived' ? 'tag-red' : ''}
        `}>
          {tool.status || 'Unknown'}
        </Badge>
        <Button asChild>
          <Link to={`/ai-tools/${tool.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AIToolsPage;

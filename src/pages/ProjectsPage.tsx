import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppWindow, CircuitBoard, Filter, Folder, Plus, Search, Server, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  id: string;
  name: string;
  description: string | null;
  toolsCount?: number;
  applicationsCount?: number;
  serversCount?: number;
  status: string;
  favorite: boolean;
  tags: string[];
  tools_count?: number;
  applications_count?: number;
  servers_count?: number;
}

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const isAuthenticated = !!session.user;
  
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching projects from public schema');
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching projects:', error);
          toast.error(`Failed to load projects: ${error.message}`);
          throw error;
        }
        
        console.log('Fetched projects:', data);
        
        // Normalize the data to match our interface
        const normalizedProjects = data.map(project => ({
          ...project,
          toolsCount: project.tools_count || 0,
          applicationsCount: project.applications_count || 0,
          serversCount: project.servers_count || 0,
        }));
        
        setProjects(normalizedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && project.favorite;
    if (activeFilter === 'active') return matchesSearch && project.status === 'Active';
    if (activeFilter === 'development') return matchesSearch && project.status === 'Development';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your AI project workspaces
          </p>
        </div>
        <Button asChild>
          <Link to={isAuthenticated ? "/projects/new" : "/login"}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
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
              All Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('favorite')}>
              Favorites
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('active')}>
              Active Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('development')}>
              In Development
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!isAuthenticated && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertTitle>Limited Access Mode</AlertTitle>
          <AlertDescription>
            You're browsing in read-only mode. Sign in to create or manage projects.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
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
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Folder className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {searchQuery 
                  ? "No projects match your search criteria. Try adjusting your filters."
                  : "There are no projects available yet. Create your first project to get started."}
              </p>
              {isAuthenticated && (
                <Button asChild>
                  <Link to="/projects/new">Create Project</Link>
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
          ) : filteredProjects.filter(p => p.favorite).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.filter(p => p.favorite).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorite projects</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                You haven't marked any projects as favorites yet.
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
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center">
              <Folder className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recent projects</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                There are no recent projects to display.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            {project.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {project.description || 'No description available'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags && project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.tools_count || project.toolsCount || 0} tools</span>
          </div>
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.applications_count || project.applicationsCount || 0} apps</span>
          </div>
          <div className="flex items-center">
            <Server className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.servers_count || project.serversCount || 0} servers</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`
          ${project.status === 'Active' ? 'tag-green' : ''}
          ${project.status === 'Development' ? 'tag-purple' : ''}
          ${project.status === 'Maintenance' ? 'tag-yellow' : ''}
          ${project.status === 'Archived' ? 'tag-red' : ''}
        `}>
          {project.status}
        </Badge>
        <Button asChild>
          <Link to={`/projects/${project.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProjectsPage;

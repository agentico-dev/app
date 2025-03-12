import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppWindow, CircuitBoard, Filter, Plus, Search, Server, Shield, Star, Tag } from 'lucide-react';
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

interface Project {
  id: string;
  name: string;
  description: string;
  toolsCount: number;
  applicationsCount: number;
  serversCount: number;
  status: 'Active' | 'Development' | 'Maintenance' | 'Archived';
  favorite: boolean;
  tags: string[];
}

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { session } = useAuth();
  const isAuthenticated = !!session.user;
  
  const projects: Project[] = [
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'AI-powered support chatbot for customer service',
      toolsCount: 8,
      applicationsCount: 2,
      serversCount: 3,
      status: 'Active',
      favorite: true,
      tags: ['production', 'nlp', 'support'],
    },
    {
      id: '2',
      name: 'Data Analysis Pipeline',
      description: 'Advanced analytics pipeline for business intelligence',
      toolsCount: 12,
      applicationsCount: 3,
      serversCount: 5,
      status: 'Active',
      favorite: true,
      tags: ['analytics', 'ml', 'production'],
    },
    {
      id: '3',
      name: 'Content Generation System',
      description: 'AI tools for generating marketing and content materials',
      toolsCount: 6,
      applicationsCount: 1,
      serversCount: 2,
      status: 'Development',
      favorite: false,
      tags: ['content', 'marketing', 'nlp'],
    },
    {
      id: '4',
      name: 'Recommendation Engine',
      description: 'ML-powered product and content recommendation system',
      toolsCount: 9,
      applicationsCount: 2,
      serversCount: 4,
      status: 'Maintenance',
      favorite: false,
      tags: ['ml', 'recommendation', 'production'],
    },
    {
      id: '5',
      name: 'Image Recognition Suite',
      description: 'Computer vision tools for image analysis and processing',
      toolsCount: 11,
      applicationsCount: 3,
      serversCount: 6,
      status: 'Development',
      favorite: false,
      tags: ['vision', 'ml', 'beta'],
    },
    {
      id: '6',
      name: 'Predictive Maintenance',
      description: 'Predictive system for equipment maintenance scheduling',
      toolsCount: 7,
      applicationsCount: 1,
      serversCount: 3,
      status: 'Active',
      favorite: true,
      tags: ['iot', 'ml', 'production'],
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && project.favorite;
    if (activeFilter === 'active') return matchesSearch && project.status === 'Active';
    if (activeFilter === 'development') return matchesSearch && project.status === 'Development';
    
    return matchesSearch;
  });

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    'Development': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    'Maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  };

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.filter(p => p.favorite).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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
            {project.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.toolsCount} tools</span>
          </div>
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.applicationsCount} apps</span>
          </div>
          <div className="flex items-center">
            <Server className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.serversCount} servers</span>
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


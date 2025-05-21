
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import refactored components
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import { Project } from '@/components/projects/ProjectCard';

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
      <ProjectsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveFilter={setActiveFilter}
        isAuthenticated={isAuthenticated}
      />

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
          <ProjectsGrid 
            projects={filteredProjects}
            isLoading={isLoading}
            type="all"
            searchQuery={searchQuery}
            isAuthenticated={isAuthenticated}
          />
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <ProjectsGrid 
            projects={filteredProjects}
            isLoading={isLoading}
            type="favorites"
            searchQuery={searchQuery}
            isAuthenticated={isAuthenticated}
          />
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <ProjectsGrid 
            projects={filteredProjects}
            isLoading={isLoading}
            type="recent"
            searchQuery={searchQuery}
            isAuthenticated={isAuthenticated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProjectsPage;

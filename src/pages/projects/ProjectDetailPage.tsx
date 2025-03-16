
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, CircuitBoard, AppWindow, Server, Calendar, Tag, User, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  description: string | null;
  tools_count?: number;
  applications_count?: number;
  servers_count?: number;
  status: string;
  favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  user_email?: string | null;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching project details for ID:', id);
        
        // Fetch the project with creator's email (using a join)
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            profiles:created_by (email)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching project details:', error);
          toast.error(`Failed to load project: ${error.message}`);
          throw error;
        }
        
        // Transform the data to match our interface
        const projectData: Project = {
          ...data,
          user_email: data.profiles?.email || null
        };
        
        console.log('Fetched project details:', projectData);
        setProject(projectData);
      } catch (error) {
        console.error('Error in project fetch:', error);
        toast.error('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Active': return 'tag-green';
      case 'Development': return 'tag-purple';
      case 'Maintenance': return 'tag-yellow';
      case 'Archived': return 'tag-red';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Button>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : project ? (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                {project.favorite && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
              </div>
              <p className="text-muted-foreground mt-1">{project.description || 'No description provided'}</p>
              
              <div className="flex flex-wrap gap-2 my-3">
                <Badge className={getStatusColorClass(project.status)}>
                  {project.status}
                </Badge>
                {project.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">Edit Project</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CircuitBoard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>AI Tools</span>
                    </div>
                    <span className="font-medium">{project.tools_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <AppWindow className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Applications</span>
                    </div>
                    <span className="font-medium">{project.applications_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Servers</span>
                    </div>
                    <span className="font-medium">{project.servers_count || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{project.user_email || 'Unknown user'}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Created: {project.created_at ? format(new Date(project.created_at), 'PPP') : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Updated: {project.updated_at ? format(new Date(project.updated_at), 'PPP') : 'Unknown'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="tools">AI Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Detailed information about this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {project.description || 'No detailed description available for this project.'}
                  </p>
                  {/* Additional overview content could be added here */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>Applications associated with this project</CardDescription>
                </CardHeader>
                <CardContent>
                  {project.applications_count ? (
                    <p>Applications will be listed here.</p>
                  ) : (
                    <div className="text-center p-6">
                      <AppWindow className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Applications</h3>
                      <p className="text-muted-foreground mb-4">
                        There are no applications associated with this project yet.
                      </p>
                      <Button>Create Application</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Services associated with this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground p-6">
                    Services information will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tools" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Tools</CardTitle>
                  <CardDescription>AI tools associated with this project</CardDescription>
                </CardHeader>
                <CardContent>
                  {project.tools_count ? (
                    <p>AI Tools will be listed here.</p>
                  ) : (
                    <div className="text-center p-6">
                      <CircuitBoard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No AI Tools</h3>
                      <p className="text-muted-foreground mb-4">
                        There are no AI tools associated with this project yet.
                      </p>
                      <Button>Create AI Tool</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The project you're looking for does not exist or has been removed.
          </p>
          <Button onClick={handleGoBack}>Return to Projects</Button>
        </div>
      )}
    </div>
  );
}

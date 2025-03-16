
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Server as ServerIcon, Calendar, Tag, User, Star, AppWindow, CircuitBoard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Server } from '@/types/server';
import { useTags } from '@/contexts/TagsContext';

export default function ServerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tags } = useTags();

  useEffect(() => {
    const fetchServerDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching server details for ID:', id);
        
        // Fetch the server with creator's email (using a join)
        const { data, error } = await supabase
          .from('servers')
          .select(`
            *,
            profiles:user_id (email)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching server details:', error);
          toast.error(`Failed to load server: ${error.message}`);
          throw error;
        }
        
        console.log('Fetched server details:', data);
        setServer(data as Server);
      } catch (error) {
        console.error('Error in server fetch:', error);
        toast.error('Failed to load server details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServerDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'deprecated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Servers
      </Button>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : server ? (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{server.name}</h1>
                {server.favorite && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
              </div>
              <p className="text-muted-foreground mt-1">{server.description || 'No description provided'}</p>
              
              <div className="flex flex-wrap gap-2 my-3">
                <Badge className={getStatusColorClass(server.status)}>
                  {server.status}
                </Badge>
                <Badge variant="outline">{server.type}</Badge>
                {server.tags?.map((tagId) => {
                  const tagName = tags.find(t => t.id === tagId)?.name || 'Unknown';
                  return (
                    <Badge key={tagId} variant="secondary">{tagName}</Badge>
                  );
                })}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">Edit Server</Button>
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
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <AppWindow className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Applications</span>
                    </div>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Server Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ServerIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Type: {server.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Tags: {server.tags.length}</span>
                  </div>
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
                    <span>Created: {server.created_at ? format(new Date(server.created_at), 'PPP') : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Updated: {server.updated_at ? format(new Date(server.updated_at), 'PPP') : 'Unknown'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Server Overview</CardTitle>
                  <CardDescription>Detailed information about this server</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {server.description || 'No detailed description available for this server.'}
                  </p>
                  {/* Additional overview content could be added here */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>Applications deployed on this server</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <AppWindow className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Applications</h3>
                    <p className="text-muted-foreground mb-4">
                      There are no applications deployed on this server yet.
                    </p>
                    <Button>Deploy Application</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-tools" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Tools</CardTitle>
                  <CardDescription>AI tools deployed on this server</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <CircuitBoard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No AI Tools</h3>
                    <p className="text-muted-foreground mb-4">
                      There are no AI tools deployed on this server yet.
                    </p>
                    <Button>Deploy AI Tool</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Server Logs</CardTitle>
                  <CardDescription>System logs and monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">
                      Log monitoring is not available for this server.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold mb-2">Server Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The server you're looking for does not exist or has been removed.
          </p>
          <Button onClick={handleGoBack}>Return to Servers</Button>
        </div>
      )}
    </div>
  );
}

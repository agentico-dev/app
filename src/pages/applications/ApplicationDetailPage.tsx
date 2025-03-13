
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlusCircle, Settings, Code, MessageSquare } from 'lucide-react';
import { useApplication } from '@/hooks/useApplications';
import APIsList from '@/components/applications/APIsList';
import ServicesList from '@/components/applications/ServicesList';
import MessagesList from '@/components/applications/MessagesList';
import ApplicationSettings from '@/components/applications/ApplicationSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('apis');
  
  const { data: application, isLoading, error } = useApplication(id);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading application',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/applications');
    }
  }, [error, navigate, toast]);

  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" asChild>
        <div onClick={() => navigate('/applications')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
        </div>
      </Button>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : application ? (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{application.name}</h1>
            <p className="text-muted-foreground">{application.description}</p>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="apis">
                <Code className="h-4 w-4 mr-2" /> APIs
              </TabsTrigger>
              <TabsTrigger value="services">
                <Settings className="h-4 w-4 mr-2" /> Services
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" /> Messages
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apis" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Application APIs</h2>
                <Button onClick={() => navigate(`/applications/${id}/apis/new`)}>
                  <PlusCircle className="h-4 w-4 mr-2" /> New API
                </Button>
              </div>
              <APIsList applicationId={id} />
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Application Services</h2>
                <Button onClick={() => navigate(`/applications/${id}/services/new`)}>
                  <PlusCircle className="h-4 w-4 mr-2" /> New Service
                </Button>
              </div>
              <ServicesList applicationId={id} />
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Application Messages</h2>
                <Button onClick={() => navigate(`/applications/${id}/messages/new`)}>
                  <PlusCircle className="h-4 w-4 mr-2" /> New Message
                </Button>
              </div>
              <MessagesList applicationId={id} />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>
                    Manage your application settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationSettings application={application} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Application not found</h2>
          <p className="text-muted-foreground">
            The application you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button className="mt-4" onClick={() => navigate('/applications')}>
            Go to Applications
          </Button>
        </div>
      )}
    </div>
  );
}

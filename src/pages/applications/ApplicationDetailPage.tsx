
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlusCircle, Settings, Code } from 'lucide-react';
import { useApplication } from '@/hooks/useApplications';
import APIsList from '@/components/applications/APIsList';
import ApplicationSettings from '@/components/applications/ApplicationSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Application } from '@/types/application';
import { BreadcrumbNav } from '@/components/layout/BreadcrumbNav';

export default function ApplicationDetailPage() {
  const { id, orgSlug, appSlug } = useParams<{ id?: string; orgSlug?: string; appSlug?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('apis');
  
  // Function to get application by slug
  const getApplicationBySlug = async () => {
    console.log('Fetching application by slug:', orgSlug, appSlug);
    if (!orgSlug || !appSlug) return null;
    
    // First, get the organization ID from the slug
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', orgSlug)
      .single();
      
    if (orgError) throw orgError;
    
    // Then get the application using org ID and app slug
    const { data: app, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('organization_id', org.id)
      .eq('slug', appSlug)
      .single();
      
    if (appError) throw appError;
    
    return app as Application;
  };
  
  // Query by ID if id is provided
  const { data: applicationById, isLoading: isLoadingById, error: errorById } = useApplication(id);
  
  // Query by slug if orgSlug and appSlug are provided
  const { data: applicationBySlug, isLoading: isLoadingBySlug, error: errorBySlug } = useQuery({
    queryKey: ['application', orgSlug, appSlug],
    queryFn: getApplicationBySlug,
    enabled: !id && !!orgSlug && !!appSlug,
  });
  
  // Combine the results
  const application = applicationById || applicationBySlug;
  const isLoading = isLoadingById || isLoadingBySlug;
  const error = errorById || errorBySlug;

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading application',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/apps');
    }
  }, [error, navigate, toast]);

  // Determine the correct URL format for the application
  const getApplicationUrl = () => {
    if (orgSlug && appSlug) {
      return `/apps/${orgSlug}@${appSlug}`;
    }
    if (application?.organization_slug && application?.slug) {
      return `/apps/${application.organization_slug}@${application.slug}`;
    }
    return '/apps';
  };

  const breadcrumbItems = [
    { label: 'Applications', path: '/applications' },
    { label: application?.name || 'Application Details', path: getApplicationUrl() }
  ];

  return (
    <div className="container py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <Button variant="ghost" asChild>
        <div onClick={() => navigate('/apps')}>
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
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="apis">
                <Code className="h-4 w-4 mr-2" /> APIs
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apis" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">Application APIs</h2>
                <Button onClick={() => {
                  if (orgSlug && appSlug) {
                    navigate(`/apps/${orgSlug}@${appSlug}/apis/new`);
                  } else if (id) {
                    navigate(`/applications/${id}/apis/new`);
                  }
                }}>
                  <PlusCircle className="h-4 w-4 mr-2" /> New API
                </Button>
              </div>
              <APIsList applicationId={application.id} />
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
          <Button className="mt-4" onClick={() => navigate('/apps')}>
            Go to Applications
          </Button>
        </div>
      )}
    </div>
  );
}

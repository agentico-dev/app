
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useApplicationApi, useApplicationApis } from '@/hooks/application-apis';
import { useApplication } from '@/hooks/useApplications';
import { ApplicationAPI } from '@/types/application';
import { toast } from 'sonner';
import { ApiForm } from './components/ApiForm';
import { BreadcrumbNav } from '@/components/layout/BreadcrumbNav';

export default function ApiFormPage() {
  const { applicationId, apiId } = useParams<{ applicationId: string; apiId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromQuery = searchParams.get('tab');
  const isNew = !apiId;
  
  const { data: api, isLoading: isLoadingApi } = useApplicationApi(apiId);
  const { data: application } = useApplication(applicationId);
  const { createApi, updateApi } = useApplicationApis(applicationId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sourceType, setSourceType] = useState<'uri' | 'content'>('uri');
  const [codeLanguage, setCodeLanguage] = useState<'json' | 'yaml'>('json');
  const [shouldFetchContent, setShouldFetchContent] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromQuery || 'details');
  
  const form = useForm<Partial<ApplicationAPI> & { fetchContent?: boolean }>({
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      version: '',
      source_uri: '',
      source_content: '',
      content_format: 'json',
      tags: [],
      fetchContent: false
    },
  });

  useEffect(() => {
    if (api && !isNew) {      
      console.log('Loading API data into form:', api);
      
      // Reset form with existing API data
      form.reset({
        name: api.name || '',
        description: api.description || '',
        status: api.status || 'active',
        version: api.version || '',
        source_uri: api.source_uri || '',
        source_content: api.source_content || '',
        content_format: api.content_format || 'json',
        tags: api.tags || [],
      });
      
      // Set source type based on which field has data
      if (api.source_content) {
        setSourceType('content');
        
        // Set code language from content_format
        setCodeLanguage(api.content_format === 'yaml' ? 'yaml' : 'json');
      } else {
        setSourceType('uri');
      }
    }
  }, [api, form, isNew]);

  // Update URL when tab changes without full page reload
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    if (activeTab !== 'details') {
      newSearchParams.set('tab', activeTab);
    } else {
      newSearchParams.delete('tab');
    }
    
    const newSearch = newSearchParams.toString();
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    
    // Only update if the path would change
    if (newPath !== location.pathname + location.search) {
      navigate(newPath, { replace: true });
    }
  }, [activeTab, location.pathname, location.search, navigate]);

  const onSubmit = async (data: Partial<ApplicationAPI> & { fetchContent?: boolean }) => {
    if (!applicationId) {
      toast.error('Application ID is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting form with data:', {
        ...data,
        fetchContent: shouldFetchContent,
        content_format: codeLanguage
      });
      
      if (isNew) {
        await createApi.mutateAsync({
          ...data,
          application_id: applicationId,
          fetchContent: shouldFetchContent,
          content_format: codeLanguage
        });
        toast.success('API created successfully');
      } else if (apiId) {
        const result = await updateApi.mutateAsync({
          ...data,
          id: apiId,
          fetchContent: shouldFetchContent,
          content_format: codeLanguage
        });
        console.log('Update result:', result);
        toast.success('API updated successfully');
      }
      navigate(`/applications/${applicationId}`);
    } catch (error: any) {
      console.error('Error saving API:', error);
      toast.error(`Failed to save API: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFetchContent = async () => {
    const sourceUri = form.watch('source_uri');
    
    if (!sourceUri) {
      toast.error('Please enter a source URI first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { fetchContentFromUri } = await import('@/utils/apiContentUtils');
      const { content, format } = await fetchContentFromUri(sourceUri);
      
      form.setValue('source_content', content);
      setCodeLanguage(format);
      setSourceType('content');
      
      toast.success('Content fetched successfully');
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast.error(`Failed to fetch content: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!applicationId) {
    return <div>Application ID is required</div>;
  }

  // Generate a slug for the API if we have a name
  const apiSlug = api?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 
                 form.watch('name')?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 
                 'api';

  // Prepare breadcrumb items
  const breadcrumbItems = [
    { label: 'Applications', path: '/applications' },
    { label: application?.name || 'Application', path: `/applications/${applicationId}` },
    { label: isNew ? 'New API' : (api?.name || 'Edit API') }
  ];

  return (
    <div className="container py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <Button variant="ghost" onClick={() => navigate(`/applications/${applicationId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Application
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? 'Create New API' : 'Edit API'}
        </h1>
        <p className="text-muted-foreground">
          {isNew ? 'Define a new API for your application' : 'Update the API details'}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>API Details</CardTitle>
          <CardDescription>
            Fill in the details of your API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <ApiForm 
              form={form}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              isNew={isNew}
              applicationId={applicationId}
              sourceType={sourceType}
              setSourceType={setSourceType}
              codeLanguage={codeLanguage}
              setCodeLanguage={setCodeLanguage}
              onFetchContent={handleFetchContent}
              setShouldFetchContent={setShouldFetchContent}
              shouldFetchContent={shouldFetchContent}
              applicationSlug={application?.slug}
              organizationSlug={application?.organization_slug}
              apiVersion={form.watch('version') || '1.0.0'}
              apiSlug={apiSlug}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              apiId={apiId}
            />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useApplicationApi, useApplicationApis } from '@/hooks/useApplicationApis';
import { useApplication } from '@/hooks/useApplications';
import { ApplicationAPI } from '@/types/application';
import { toast } from 'sonner';
import { ApiForm } from './components/ApiForm';
import { BreadcrumbNav } from '@/components/layout/BreadcrumbNav';

export default function ApiFormPage() {
  const { applicationId, apiId } = useParams<{ applicationId: string; apiId?: string }>();
  const navigate = useNavigate();
  const isNew = !apiId;
  
  const { data: api, isLoading: isLoadingApi } = useApplicationApi(apiId);
  const { data: application } = useApplication(applicationId);
  const { createApi, updateApi } = useApplicationApis(applicationId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sourceType, setSourceType] = useState<'uri' | 'content'>('uri');
  const [codeLanguage, setCodeLanguage] = useState<'json' | 'yaml'>('json');
  const [shouldFetchContent, setShouldFetchContent] = useState(false);
  
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
            />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

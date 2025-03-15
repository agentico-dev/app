
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  
  const form = useForm<Partial<ApplicationAPI>>({
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      version: '',
      source_uri: '',
      source_content: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (api && !isNew) {
      console.log("API data loaded for form:", api);
      
      // Reset form with existing API data
      form.reset({
        name: api.name || '',
        description: api.description || '',
        status: api.status || 'active',
        version: api.version || '',
        source_uri: api.source_uri || '',
        source_content: api.source_content || '',
        tags: api.tags || [],
      });
      
      // Set source type based on which field has data
      if (api.source_content) {
        setSourceType('content');
        
        // Try to determine the language type from the content
        try {
          JSON.parse(api.source_content);
          setCodeLanguage('json');
        } catch {
          setCodeLanguage('yaml');
        }
      } else {
        setSourceType('uri');
      }
    }
  }, [api, form, isNew]);

  const onSubmit = async (data: Partial<ApplicationAPI>) => {
    if (!applicationId) {
      toast.error('Application ID is required');
      return;
    }
    
    console.log('Form submission data:', data);
    
    // Ensure only one source type is saved based on the selected option
    const submissionData = { ...data };
    
    if (sourceType === 'uri') {
      submissionData.source_content = '';
    } else {
      submissionData.source_uri = '';
    }
    
    setIsSubmitting(true);
    try {
      if (isNew) {
        await createApi.mutateAsync({
          ...submissionData,
          application_id: applicationId,
        });
        toast.success('API created successfully');
      } else if (apiId) {
        await updateApi.mutateAsync({
          ...submissionData,
          id: apiId,
        });
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
            />
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

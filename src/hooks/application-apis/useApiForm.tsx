
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { fetchContentFromUri } from '@/utils/apiContentUtils';
import { ApplicationAPI } from '@/types/application';
import { useApplicationApis } from '@/hooks/useApplicationApis';

// Define the schema for API form validation
const apiFormSchema = z.object({
  name: z.string().min(2, {
    message: 'API Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.enum(['active', 'inactive', 'deprecated', 'archived']).default('active'),
  tags: z.array(z.string()).optional(),
  source_uri: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.string().length(0)),
  source_content: z.string().optional(),
  content_format: z.enum(['json', 'yaml']).optional(),
  protocol: z.enum(['REST', 'gRPC', 'WebSockets', 'GraphQL']).optional(),
  endpoint_url: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.string().length(0)),
  documentation_url: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.string().length(0)),
  fetchContent: z.boolean().optional(),
});

// Export the type from the schema
export type ApiFormValues = z.infer<typeof apiFormSchema>;

interface UseApiFormProps {
  applicationId?: string;
  apiId?: string;
}

export function useApiForm({ applicationId, apiId }: UseApiFormProps) {
  const navigate = useNavigate();
  const isEditMode = !!apiId;
  const [initialValues, setInitialValues] = useState<ApplicationAPI | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [sourceType, setSourceType] = useState<'uri' | 'content'>('uri');
  const [codeLanguage, setCodeLanguage] = useState<'json' | 'yaml'>('json');
  const [shouldFetchContent, setShouldFetchContent] = useState(false);
  
  // Get API data from the useApplicationApis hook
  const { 
    apis, 
    isLoading: isApiLoading, 
    error: apiError, 
    createApi, 
    updateApi 
  } = useApplicationApis(applicationId || '');

  // Form setup with zod validation
  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      name: '',
      description: '',
      version: '',
      status: 'active',
      tags: [],
      source_uri: '',
      source_content: '',
      content_format: 'json',
      protocol: 'REST',
      endpoint_url: '',
      documentation_url: '',
    },
    mode: 'onChange',
  });

  // Set initial values when API data is loaded
  useEffect(() => {
    if (apis && isEditMode) {
      const selectedApi = apis.find((a) => a.id === apiId);
      if (selectedApi) {
        setInitialValues(selectedApi);
        
        // Set source type based on API data
        if (selectedApi.source_content) {
          setSourceType('content');
        } else if (selectedApi.source_uri) {
          setSourceType('uri');
        }
        
        // Set code language
        if (selectedApi.content_format) {
          setCodeLanguage(selectedApi.content_format as 'json' | 'yaml');
        }
      }
    }
  }, [apis, isEditMode, apiId]);

  // Update form values when initial values change
  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
        description: initialValues.description || '',
        version: initialValues.version || '',
        status: initialValues.status || 'active',
        tags: initialValues.tags || [],
        source_uri: initialValues.source_uri || '',
        source_content: initialValues.source_content || '',
        content_format: initialValues.content_format as 'json' | 'yaml' || 'json',
        protocol: initialValues.protocol as any || 'REST',
        endpoint_url: initialValues.endpoint_url || '',
        documentation_url: initialValues.documentation_url || '',
      });
    }
  }, [initialValues, form]);

  // Handle fetching content from URI
  const handleFetchContent = useCallback(async () => {
    const uri = form.getValues('source_uri');
    if (!uri) return;
    
    setIsContentLoading(true);
    try {
      const { content, format } = await fetchContentFromUri(uri);
      form.setValue('source_content', content);
      form.setValue('content_format', format as 'json' | 'yaml');
      setCodeLanguage(format as 'json' | 'yaml');
      toast.success('Content fetched successfully');
    } catch (error: any) {
      toast.error('Error fetching content: ' + error.message);
    } finally {
      setIsContentLoading(false);
    }
  }, [form]);

  // Handle form submission
  const onSubmit = async (values: ApiFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare API data
      const apiData: Partial<ApplicationAPI> = {
        name: values.name,
        description: values.description,
        version: values.version,
        status: values.status,
        tags: values.tags,
        source_uri: values.source_uri,
        content_format: values.content_format,
        protocol: values.protocol,
        endpoint_url: values.endpoint_url,
        documentation_url: values.documentation_url,
      };
      
      // Include source content if available
      if (values.source_content) {
        apiData.source_content = values.source_content;
      }
      
      if (isEditMode) {
        // Update existing API
        await updateApi.mutateAsync({ 
          id: apiId as string, 
          ...apiData, 
          fetchContent: shouldFetchContent 
        });
        toast.success('API updated successfully');
      } else {
        // Create new API
        if (!applicationId) throw new Error('Application ID is missing for create operation.');
        await createApi.mutateAsync({ 
          application_id: applicationId, 
          ...apiData,
          fetchContent: shouldFetchContent
        });
        toast.success('API created successfully');
      }
      
      // Navigate back to applications page
      navigate(`/applications/${applicationId}/apis`);
    } catch (error: any) {
      console.error('Error saving API:', error);
      toast.error('Error saving API: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isEditMode,
    isSubmitting,
    isApiLoading,
    apiError,
    sourceType,
    setSourceType,
    codeLanguage,
    setCodeLanguage,
    handleFetchContent,
    shouldFetchContent,
    setShouldFetchContent,
    initialValues,
    onSubmit,
    isContentLoading
  };
}

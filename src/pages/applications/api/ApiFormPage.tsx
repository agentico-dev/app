import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useApplications, useApplicationAPIs } from '@/hooks';
import { ApplicationAPI } from '@/types/application';
import { fetchContentFromUri } from '@/utils/apiContentUtils';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const apiFormSchema = z.object({
  name: z.string().min(2, {
    message: 'API Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  protocol: z.enum(['REST', 'gRPC', 'WebSockets', 'GraphQL']),
  endpoint_url: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
  documentation_url: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
  source_uri: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
  content_format: z.enum(['json', 'yaml']).optional(),
  source_content: z.string().optional(),
  shouldFetchContent: z.boolean().default(false),
});

const ApiFormPage = () => {
  const navigate = useNavigate();
  const { applicationId, apiId } = useParams<{ applicationId: string; apiId: string }>();
  const [isEditMode, setIsEditMode] = useState(!!apiId);
  const [initialValues, setInitialValues] = useState<ApplicationAPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const { application } = useApplications(applicationId || '');
  const { organization } = useOrganizations();
  const { 
    api, 
    isLoading: isApiLoading, 
    error: apiError, 
    createAPI, 
    updateAPI 
  } = useApplicationAPIs(applicationId || '', apiId || '');

  useEffect(() => {
    if (api && isEditMode) {
      setInitialValues(api);
    }
  }, [api, isEditMode]);

  const form = useForm<z.infer<typeof apiFormSchema>>({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      protocol: initialValues?.protocol || 'REST',
      endpoint_url: initialValues?.endpoint_url || '',
      documentation_url: initialValues?.documentation_url || '',
      source_uri: initialValues?.source_uri || '',
      content_format: initialValues?.content_format || 'json',
      source_content: initialValues?.source_content || '',
      shouldFetchContent: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const handleContentFetch = useCallback(async (uri: string) => {
    setIsContentLoading(true);
    try {
      const { content, format } = await fetchContentFromUri(uri);
      form.setValue('source_content', content);
      form.setValue('content_format', format);
      toast({
        title: 'Content fetched successfully',
        description: 'The content from the URI has been fetched and populated in the Source Content field.',
      });
    } catch (error: any) {
      toast({
        title: 'Error fetching content',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsContentLoading(false);
    }
  }, [form]);

  const handleContentSubmit = async (values: any) => {
    try {
      const apiDataToUpdate: Partial<ApplicationAPI> & { shouldFetchContent?: boolean } = {
        name: values.name,
        description: values.description,
        protocol: values.protocol as any,
        endpoint_url: values.endpoint_url,
        documentation_url: values.documentation_url,
        source_uri: values.source_uri,
        content_format: values.content_format,
        shouldFetchContent: values.shouldFetchContent,
      };

      if (values.source_content) {
        apiDataToUpdate.source_content = values.source_content;
      }

      setIsLoading(true);

      if (isEditMode) {
        if (!apiId) throw new Error('API ID is missing for update operation.');
        await updateAPI.mutateAsync({ id: apiId, ...apiDataToUpdate });
        toast({
          title: 'API updated successfully',
          description: 'The API has been updated successfully.',
        });
      } else {
        if (!applicationId) throw new Error('Application ID is missing for create operation.');
        await createAPI.mutateAsync({ application_id: applicationId, ...apiDataToUpdate });
        toast({
          title: 'API created successfully',
          description: 'The API has been created successfully.',
        });
      }

      navigate(`/applications/${applicationId}/apis`);
    } catch (error: any) {
      toast({
        title: 'Error saving API',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isApiLoading) {
    return (
      <Alert>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <AlertDescription>
          Loading API data...
        </AlertDescription>
      </Alert>
    );
  }

  if (!application) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          No application found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit API' : 'Create API'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Edit the API details below.' : 'Create a new API for your application.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleContentSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Name</FormLabel>
                  <FormControl>
                    <Input placeholder="API Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="API Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a protocol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="REST">REST</SelectItem>
                      <SelectItem value="gRPC">gRPC</SelectItem>
                      <SelectItem value="WebSockets">WebSockets</SelectItem>
                      <SelectItem value="GraphQL">GraphQL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com/endpoint" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentation_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentation URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com/docs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source_uri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source URI</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input placeholder="https://raw.githubusercontent.com/example/api/openapi.yaml" {...field} />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleContentFetch(field.value)}
                        disabled={isContentLoading || !field.value}
                      >
                        {isContentLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Fetching...
                          </>
                        ) : (
                          'Fetch Content'
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the URI to fetch the API definition from a remote source.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="yaml">YAML</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="API Definition Content" className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="shouldFetchContent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto-Fetch Content</FormLabel>
                      <FormDescription>
                        Automatically fetch content from the Source URI on save.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save API'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ApiFormPage;

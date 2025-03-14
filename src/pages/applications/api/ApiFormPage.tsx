
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useApplicationApi, useApplicationApis } from '@/hooks/useApplicationApis';
import { ApplicationAPI } from '@/types/application';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ApiFormPage() {
  const { applicationId, apiId } = useParams<{ applicationId: string; apiId?: string }>();
  const navigate = useNavigate();
  const isNew = !apiId;
  
  const { data: api, isLoading: isLoadingApi } = useApplicationApi(apiId);
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
      endpoint_url: '',
      documentation_url: '',
      source_uri: '',
      source_content: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (api && !isNew) {
      form.reset({
        name: api.name,
        description: api.description,
        status: api.status,
        version: api.version,
        endpoint_url: api.endpoint_url,
        documentation_url: api.documentation_url,
        source_uri: api.source_uri,
        source_content: api.source_content,
        tags: api.tags,
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
    if (!applicationId) return;
    
    // Ensure only one source type is saved based on the selected option
    if (sourceType === 'uri') {
      data.source_content = undefined;
    } else {
      data.source_uri = undefined;
    }
    
    setIsSubmitting(true);
    try {
      if (isNew) {
        await createApi.mutateAsync({
          ...data,
          application_id: applicationId,
        });
        toast.success('API created successfully');
      } else if (apiId) {
        await updateApi.mutateAsync({
          ...data,
          id: apiId,
        });
        toast.success('API updated successfully');
      }
      navigate(`/applications/${applicationId}`);
    } catch (error) {
      console.error('Error saving API:', error);
      toast.error('Failed to save API');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" asChild>
        <div onClick={() => navigate(`/applications/${applicationId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Application
        </div>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter API name" {...field} />
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
                      <Textarea
                        placeholder="Describe your API"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what this API does.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="deprecated">Deprecated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The current status of this API.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1.0.0" {...field} />
                      </FormControl>
                      <FormDescription>
                        The version of this API.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="endpoint_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.example.com/v1" {...field} />
                    </FormControl>
                    <FormDescription>
                      The base URL for this API.
                    </FormDescription>
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
                      <Input placeholder="https://docs.example.com/api" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link to the API documentation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Source Configuration */}
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="text-lg font-medium">API Source</h3>
                
                <RadioGroup 
                  defaultValue={sourceType} 
                  onValueChange={(value) => setSourceType(value as 'uri' | 'content')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uri" id="source-uri" />
                    <FormLabel htmlFor="source-uri" className="cursor-pointer">External Source URI</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="content" id="source-content" />
                    <FormLabel htmlFor="source-content" className="cursor-pointer">Inline Source Content</FormLabel>
                  </div>
                </RadioGroup>
                
                {sourceType === 'uri' ? (
                  <FormField
                    control={form.control}
                    name="source_uri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source URI</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/api-spec.json" {...field} />
                        </FormControl>
                        <FormDescription>
                          Link to the API specification file (OpenAPI, Swagger, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FormLabel>Format</FormLabel>
                      <Select 
                        value={codeLanguage} 
                        onValueChange={(value) => setCodeLanguage(value as 'json' | 'yaml')}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="yaml">YAML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="source_content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Content</FormLabel>
                          <FormControl>
                            <CodeEditor 
                              value={field.value || ''} 
                              onChange={field.onChange}
                              language={codeLanguage}
                              className="min-h-[300px]"
                            />
                          </FormControl>
                          <FormDescription>
                            Paste or write your API specification (OpenAPI, Swagger, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tags separated by commas"
                        value={field.value?.join(', ') || ''}
                        onChange={(e) => {
                          const tags = e.target.value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean);
                          field.onChange(tags);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Tags help categorize and find your APIs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/applications/${applicationId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isNew
                      ? 'Creating...'
                      : 'Updating...'
                    : isNew
                    ? 'Create API'
                    : 'Update API'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

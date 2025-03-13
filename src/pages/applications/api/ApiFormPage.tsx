
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

export default function ApiFormPage() {
  const { applicationId, apiId } = useParams<{ applicationId: string; apiId?: string }>();
  const navigate = useNavigate();
  const isNew = !apiId;
  
  const { data: api, isLoading: isLoadingApi } = useApplicationApi(apiId);
  const { createApi, updateApi } = useApplicationApis(applicationId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Partial<ApplicationAPI>>({
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      version: '',
      endpoint_url: '',
      documentation_url: '',
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
        tags: api.tags,
      });
    }
  }, [api, form, isNew]);

  const onSubmit = async (data: Partial<ApplicationAPI>) => {
    if (!applicationId) return;
    
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

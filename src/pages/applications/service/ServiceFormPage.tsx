
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
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
import { useApplicationService, useApplicationServices } from '@/hooks/useApplicationServices';
import { ApplicationService } from '@/types/application';
import { toast } from 'sonner';

export default function ServiceFormPage() {
  const { applicationId, serviceId } = useParams<{ applicationId: string; serviceId?: string }>();
  const navigate = useNavigate();
  const isNew = !serviceId;
  
  const { data: service, isLoading: isLoadingService } = useApplicationService(serviceId);
  const { createService, updateService } = useApplicationServices(applicationId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Partial<ApplicationService>>({
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      service_type: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (service && !isNew) {
      form.reset({
        name: service.name,
        description: service.description,
        status: service.status,
        service_type: service.service_type,
        tags: service.tags,
      });
    }
  }, [service, form, isNew]);

  const onSubmit = async (data: Partial<ApplicationService>) => {
    if (!applicationId) return;
    
    setIsSubmitting(true);
    try {
      if (isNew) {
        await createService.mutateAsync({
          ...data,
          application_id: applicationId,
        });
        toast.success('Service created successfully');
      } else if (serviceId) {
        await updateService.mutateAsync({
          ...data,
          id: serviceId,
        });
        toast.success('Service updated successfully');
      }
      navigate(`/applications/${applicationId}`);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
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
          {isNew ? 'Create New Service' : 'Edit Service'}
        </h1>
        <p className="text-muted-foreground">
          {isNew ? 'Define a new service for your application' : 'Update the service details'}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Fill in the details of your service
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
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service name" {...field} />
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
                        placeholder="Describe your service"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what this service does.
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
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The current status of this service.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Microservice, Database, AI" {...field} />
                      </FormControl>
                      <FormDescription>
                        The type of this service.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      Tags help categorize and find your services.
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
                    ? 'Create Service'
                    : 'Update Service'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

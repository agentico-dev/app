
import { useState } from 'react';
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
  FormMessage 
} from '@/components/ui/form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CreateApplicationPayload, generateSlug } from '@/types/organization';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function CreateApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const form = useForm<CreateApplicationPayload>({
    defaultValues: {
      name: '',
      description: '',
      category: 'Web',
      status: 'Development',
      tags: [],
    },
  });

  const onSubmit = async (data: CreateApplicationPayload) => {
    if (!session?.user) {
      toast.error("You need to be logged in to create an application");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get organization from localStorage
      const organizationId = localStorage.getItem('selectedOrganizationId');
      
      if (!organizationId) {
        toast.error("Please select an organization from the top navigation bar");
        setIsSubmitting(false);
        return;
      }
      
      // Generate slug from name
      const slug = generateSlug(data.name);
      
      // Important: We need to explicitly set user_id to match the current user's ID
      // This is required by the RLS policy we just created
      const { data: newApp, error } = await supabase
        .from('applications')
        .insert({
          name: data.name,
          slug: slug,
          description: data.description,
          category: data.category,
          status: data.status,
          tags: data.tags,
          user_id: session.user.id, // This is crucial for RLS
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating application:', error);
        throw error;
      }
      
      toast.success('Application created successfully');
      
      // Navigate to the new application using the slug-based URL
      if (newApp) {
        // Fetch the organization slug
        const { data: org } = await supabase
          .from('organizations')
          .select('slug')
          .eq('id', organizationId)
          .single();
          
        if (org) {
          navigate(`/apps/${org.slug}@${slug}`);
        } else {
          navigate(`/apps/${newApp.id}`);
        }
      } else {
        navigate('/applications');
      }
    } catch (error: any) {
      console.error('Error creating application:', error);
      toast.error(`Failed to create application: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter application name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your application.
              </FormDescription>
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
                  placeholder="Describe your application" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description of what this application does.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web, Mobile, Desktop" {...field} />
              </FormControl>
              <FormDescription>
                The category this application belongs to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/applications')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Application'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateApplicationForm;

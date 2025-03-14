
import { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateProjectPayload } from '@/types/organization';
import { useAuth } from '@/hooks/useAuth';
import { generateSlug } from '@/utils/supabaseHelpers';
import { supabase } from '@/integrations/supabase/client';

export function CreateProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const form = useForm<CreateProjectPayload>({
    defaultValues: {
      name: '',
      description: '',
      status: 'Development',
      tags: [],
    },
  });

  // Load the selected organization from localStorage
  useEffect(() => {
    const savedOrgId = localStorage.getItem('selectedOrganizationId');
    if (savedOrgId) {
      form.setValue('organization_id', savedOrgId);
    }
  }, [form]);

  const onSubmit = async (data: CreateProjectPayload) => {
    if (!session.user) {
      toast.error("You need to be logged in to create a project");
      return;
    }
    
    // Get organization from localStorage
    const organizationId = localStorage.getItem('selectedOrganizationId');
    
    if (!organizationId) {
      toast.error("Please select an organization from the top navigation bar");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate slug from name
      const slug = generateSlug(data.name);
      
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          name: data.name,
          slug: slug,
          description: data.description,
          status: data.status,
          tags: data.tags,
          user_id: session.user.id,
          organization_id: organizationId,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Project created successfully');
      
      // Navigate to the new project page with the slug if available
      if (newProject) {
        navigate(`/projects/${newProject.slug}`);
      } else {
        navigate('/projects');
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
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
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your project.
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
                  placeholder="Describe your project" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description of what this project is about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/projects')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateProjectForm;

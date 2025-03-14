
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateProjectPayload } from '@/types/organization';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function CreateProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState<{id: string, name: string}[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const form = useForm<CreateProjectPayload>({
    defaultValues: {
      name: '',
      description: '',
      status: 'Development',
      tags: [],
      organization_id: '',
    },
  });

  // Fetch user's organizations and public ones
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!session.user) return;
      
      setIsLoadingOrgs(true);
      try {
        const { data, error } = await supabase
          .from('organization_members')
          .select(`
            organizations:organization_id(id, name)
          `)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
        
        const orgs = data.map(item => ({
          id: item.organizations.id,
          name: item.organizations.name
        }));

        // public orgs
        const { data: publicOrgs, error: publicError } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('is_public', true);
        if (publicError) throw publicError;
        orgs.push(...publicOrgs.map((org: { id: string; name: string; }) => ({
          id: org.id,
          name: org.name
        })));
        
        setOrganizations(orgs);
        
        // select first by default
        form.setValue('organization_id', orgs[0].id);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast.error('Failed to load organizations');
      } finally {
        setIsLoadingOrgs(false);
      }
    };
    
    fetchOrganizations();
  }, [session.user, form]);

  const onSubmit = async (data: CreateProjectPayload) => {
    if (!session.user) {
      toast.error("You need to be logged in to create a project");
      return;
    }
    
    if (!data.organization_id) {
      toast.error("Please select an organization");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('projects').insert({
        name: data.name,
        description: data.description,
        status: data.status,
        tags: data.tags,
        user_id: session.user.id,
        organization_id: data.organization_id,
      });

      if (error) throw error;
      
      toast.success('Project created successfully');
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {organizations.length === 0 && !isLoadingOrgs && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No organizations found</AlertTitle>
            <AlertDescription>
              You need to be a member of at least one organization to create a project.
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/orgs')}
              >
                Go to Organizations
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <Select
                disabled={isLoadingOrgs || organizations.length === 0}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingOrgs ? "Loading organizations..." : "Select an organization"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The organization this project belongs to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
            disabled={isSubmitting || organizations.length === 0 || isLoadingOrgs}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateProjectForm;

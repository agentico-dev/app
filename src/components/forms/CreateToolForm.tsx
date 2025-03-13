
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
import { CreateToolPayload } from '@/types/organization';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function CreateToolForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState<{id: string, name: string}[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const form = useForm<CreateToolPayload>({
    defaultValues: {
      name: '',
      description: '',
      category: 'AI',
      status: 'Development',
      tags: [],
      organization_id: '',
    },
  });

  // Fetch user's organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!session.user) return;
      
      setIsLoadingOrgs(true);
      try {
        const { data, error } = await supabase
          .rpc('list_user_organizations', { user_id: session.user.id })
          .select('*');
        
        if (error) throw error;
        
        const orgs = data.map(item => ({
          id: item.id,
          name: item.name
        }));
        
        setOrganizations(orgs);
        
        // If there's only one organization, select it by default
        if (orgs.length === 1) {
          form.setValue('organization_id', orgs[0].id);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast.error('Failed to load organizations');
      } finally {
        setIsLoadingOrgs(false);
      }
    };
    
    fetchOrganizations();
  }, [session.user, form]);

  const onSubmit = async (data: CreateToolPayload) => {
    if (!session.user) {
      toast.error("You need to be logged in to create an AI tool");
      return;
    }
    
    if (!data.organization_id) {
      toast.error("Please select an organization");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('ai_tools').insert({
        name: data.name,
        description: data.description,
        category: data.category,
        status: data.status,
        tags: data.tags,
        user_id: session.user.id,
        organization_id: data.organization_id,
      });

      if (error) throw error;
      
      toast.success('AI Tool created successfully');
      navigate('/ai-tools');
    } catch (error) {
      console.error('Error creating AI tool:', error);
      toast.error('Failed to create AI tool');
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
              You need to be a member of at least one organization to create an AI tool.
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/organizations')}
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
                The organization this AI tool belongs to.
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
              <FormLabel>Tool Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter AI tool name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your AI tool.
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
                  placeholder="Describe your AI tool" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description of what this AI tool does.
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
                <Input placeholder="e.g., NLP, Computer Vision, ML" {...field} />
              </FormControl>
              <FormDescription>
                The category this AI tool belongs to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/ai-tools')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || organizations.length === 0 || isLoadingOrgs}
          >
            {isSubmitting ? 'Creating...' : 'Create AI Tool'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateToolForm;

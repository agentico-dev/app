
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateServerPayload } from '@/types/organization';
import { useAuth } from '@/hooks/useAuth';
import { generateSlug } from '@/utils/supabaseHelpers';

export function CreateServerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const form = useForm<CreateServerPayload>({
    defaultValues: {
      name: '',
      description: '',
      type: 'Virtual',
      status: 'Offline',
    },
  });

  const onSubmit = async (data: CreateServerPayload) => {
    if (!session.user) {
      toast.error("You need to be logged in to create a server");
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
      
      const { data: newServer, error } = await supabase
        .from('servers')
        .insert({
          name: data.name,
          slug: slug,
          description: data.description,
          type: data.type,
          status: data.status,
          user_id: session.user.id,
          organization_id: organizationId,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Server created successfully');
      
      // Navigate to the new server using the slug-based URL
      if (newServer) {
        // Fetch the organization slug
        const { data: org } = await supabase
          .from('organizations')
          .select('slug')
          .eq('id', organizationId)
          .single();
          
        if (org) {
          navigate(`/servers/${org.slug}@${newServer.slug}`);
        } else {
          navigate(`/servers/${newServer.id}`);
        }
      } else {
        navigate('/servers');
      }
    } catch (error: any) {
      console.error('Error creating server:', error);
      toast.error(`Failed to create server: ${error.message || 'Unknown error'}`);
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
              <FormLabel>Server Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter server name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your server.
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
                  placeholder="Describe your server" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description of what this server is for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Virtual, Physical, Cloud" {...field} />
              </FormControl>
              <FormDescription>
                The type of server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/servers')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Server'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateServerForm;

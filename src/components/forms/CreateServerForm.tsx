
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
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateServerPayload } from '@/types/organization';
import { useAuth } from '@/hooks/useAuth';

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
      // This is a placeholder as there's no servers table yet
      // In a real implementation, you would insert into the servers table
      toast.success('Server creation functionality will be implemented soon');
      navigate('/servers');
    } catch (error) {
      console.error('Error creating server:', error);
      toast.error('Failed to create server');
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

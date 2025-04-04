
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateSlug } from '@/utils/supabaseHelpers';
import { useProjectServers } from '@/hooks/useProjectServers';

interface CreateServerFormProps {
  projectId: string;
  onSuccess?: () => void;
}

interface ServerFormValues {
  name: string;
  description: string;
  slug: string;
  type: string;
  status: string;
}

export function CreateServerForm({ projectId, onSuccess }: CreateServerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth();
  const { mutateAssociatedServers } = useProjectServers(projectId);

  const form = useForm<ServerFormValues>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      type: 'Agent',
      status: 'development',
    },
  });

  const onSubmit = async (data: ServerFormValues) => {
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

      // First, create the server
      const { data: newServer, error } = await supabase
        .from('servers')
        .insert({
          name: data.name,
          slug: data.slug,
          description: data.description,
          type: data.type,
          status: data.status,
          user_id: session.user.id,
          organization_id: organizationId,
        })
        .select('*')
        .single();

      if (error) throw error;

      // Then, associate the server with the project
      if (newServer) {
        const { error: relationError } = await supabase
          .from('project_servers')
          .insert({
            project_id: projectId,
            server_id: newServer.id,
          });

        if (relationError) throw relationError;
      }

      toast.success('Server created and added to project');
      form.reset();

      // Refresh the server list
      mutateAssociatedServers();

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
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
                <Input
                  placeholder="Enter server name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue('slug', generateSlug(e.target.value));
                  }}
                />
              </FormControl>
              <FormDescription>
                A descriptive name for your server
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="text-sm text-muted-foreground">
                {field.value ? field.value.length > 35 ? field.value.slice(0, 35) + '...' : field.value : 'Auto-generated from the server name'}
              </div>
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
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of what this server is for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="MCP">MCP</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The type of server
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current server status
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              if (onSuccess) onSuccess();
            }}
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

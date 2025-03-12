
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
import { CreateToolPayload } from '@/types/organization';
import { useAuth } from '@/hooks/useAuth';

export function CreateToolForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const form = useForm<CreateToolPayload>({
    defaultValues: {
      name: '',
      description: '',
      category: 'AI',
      status: 'Development',
      tags: [],
    },
  });

  const onSubmit = async (data: CreateToolPayload) => {
    if (!session.user) {
      toast.error("You need to be logged in to create an AI tool");
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create AI Tool'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateToolForm;

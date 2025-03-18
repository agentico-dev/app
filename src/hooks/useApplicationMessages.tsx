
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { ApplicationMessage } from '@/types/application';

export function useApplicationMessages(applicationId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session.user;

  // Fetch all messages for an application
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['application-messages', applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const { data, error } = await supabase
        .from('application_messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApplicationMessage[];
    },
    enabled: !!applicationId,
  });

  // Create a new message
  const createMessage = useMutation({
    mutationFn: async (messageData: Partial<ApplicationMessage>) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('application_messages')
        .insert({
          title: messageData.title,
          content: messageData.content,
          application_id: messageData.application_id,
          api_id: messageData.api_id,
          message_type: messageData.message_type || 'notification',
          status: messageData.status || 'unread',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId] });
      toast({
        title: 'Message created',
        description: 'The message has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update a message
  const updateMessage = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ApplicationMessage> & { id: string }) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data: updatedMessage, error } = await supabase
        .from('application_messages')
        .update({
          title: data.title,
          content: data.content,
          message_type: data.message_type,
          api_id: data.api_id,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId] });
      toast({
        title: 'Message updated',
        description: 'The message has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a message
  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('application_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId] });
      toast({
        title: 'Message deleted',
        description: 'The message has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mark message as read
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('application_messages')
        .update({ status: 'read' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId] });
    },
    onError: (error) => {
      toast({
        title: 'Error updating message status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    messages,
    isLoading,
    error,
    isAuthenticated,
    createMessage,
    updateMessage,
    deleteMessage,
    markAsRead,
  };
}

// Get a single message by ID
export function useApplicationMessage(id?: string) {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['application-message', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('application_messages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ApplicationMessage;
    },
    enabled: !!id,
  });
}

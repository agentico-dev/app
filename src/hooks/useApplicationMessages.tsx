
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { ApplicationMessage } from '@/types/application';

export function useApplicationMessages(applicationId?: string, apiId?: string) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!session.user;

  // Fetch all messages for an application/api or all applications
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['application-messages', applicationId, apiId],
    queryFn: async () => {
      if (!session.user) return [];
      
      let query = supabase
        .from('application_messages')
        .select('*');
      
      // Apply filters based on what IDs we have
      if (apiId) {
        query = query.eq('api_id', apiId);
      } else if (applicationId) {
        query = query.eq('application_id', applicationId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApplicationMessage[];
    },
    enabled: !!session.user,
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
    onSuccess: (_, variables) => {
      // Invalidate both application and API queries
      if (variables.application_id) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', variables.application_id] });
      }
      if (variables.api_id) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId, variables.api_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['application-messages'] });
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
    onSuccess: (data) => {
      // Invalidate both application and API queries
      if (data.application_id) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', data.application_id] });
      }
      if (data.api_id) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId, data.api_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['application-messages'] });
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
    onSuccess: (_, variables) => {
      // Invalidate both application and API queries
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId] });
      }
      if (apiId) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId, apiId] });
      }
      queryClient.invalidateQueries({ queryKey: ['application-messages'] });
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
    onSuccess: (data) => {
      // Invalidate both application and API queries
      if (data.application_id) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', data.application_id] });
      }
      if (data.api_id) {
        queryClient.invalidateQueries({ queryKey: ['application-messages', applicationId, data.api_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['application-messages'] });
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
    enabled: !!id && !!session?.user,
  });
}


import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { Notification } from '@/types/application';

export function useNotifications() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  
  const isAuthenticated = !!session?.user;

  // Set organization ID from localStorage
  useEffect(() => {
    const orgId = localStorage.getItem('selectedOrganizationId');
    if (orgId) {
      setSelectedOrgId(orgId);
    }
  }, []);

  // Fetch all notifications
  const { 
    data: notifications = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', selectedOrgId],
    queryFn: async () => {
      if (!session?.user) return [];
      
      let query = supabase
        .from('notifications')
        .select('*');
      
      if (selectedOrgId) {
        query = query.eq('organization_id', selectedOrgId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Notification[];
    },
    enabled: isAuthenticated && !!selectedOrgId,
  });

  // Create a new notification
  const createNotification = useMutation({
    mutationFn: async (notificationData: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: session.user.id,
          organization_id: selectedOrgId,
          title: notificationData.title,
          content: notificationData.content,
          resource_type: notificationData.resource_type,
          resource_id: notificationData.resource_id,
          related_resource_id: notificationData.related_resource_id,
          status: notificationData.status || 'unread',
          notification_type: notificationData.notification_type || 'info',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', selectedOrgId] });
    },
    onError: (error) => {
      toast({
        title: 'Error creating notification',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mark a notification as read
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'read', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', selectedOrgId] });
    },
    onError: (error) => {
      toast({
        title: 'Error updating notification',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error('Authentication required');
      
      let query = supabase
        .from('notifications')
        .update({ status: 'read', updated_at: new Date().toISOString() })
        .eq('status', 'unread');
      
      if (selectedOrgId) {
        query = query.eq('organization_id', selectedOrgId);
      }
      
      const { data, error } = await query.select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', selectedOrgId] });
    },
    onError: (error) => {
      toast({
        title: 'Error updating notifications',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a notification
  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', selectedOrgId] });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting notification',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    notifications,
    unreadNotifications: notifications.filter(n => n.status === 'unread'),
    isLoading,
    error,
    isAuthenticated,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
    selectedOrgId,
  };
}

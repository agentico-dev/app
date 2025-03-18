
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { useToast } from '@/components/ui/use-toast';
import type { Notification } from '@/types/application';
import { 
  fetchNotifications, 
  createNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from './notificationsApi';
import { UseNotificationsResult } from './types';

export function useNotifications(): UseNotificationsResult {
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
    queryFn: () => fetchNotifications(session?.user?.id, selectedOrgId),
    enabled: isAuthenticated && !!selectedOrgId,
  });

  // Create a new notification
  const createNotificationMutation = useMutation({
    mutationFn: (notificationData: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => 
      createNotification(session?.user?.id, selectedOrgId, notificationData),
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
    mutationFn: (id: string) => markNotificationAsRead(session?.user?.id, id),
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
    mutationFn: () => markAllNotificationsAsRead(session?.user?.id, selectedOrgId),
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
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(session?.user?.id, id),
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
    createNotification: createNotificationMutation,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationMutation,
    refetch,
    selectedOrgId,
  };
}

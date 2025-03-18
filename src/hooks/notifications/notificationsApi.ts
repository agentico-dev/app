
import { supabase } from '@/integrations/supabase/client';
import type { Notification } from '@/types/application';

/**
 * Fetches all notifications for the current user and organization
 */
export const fetchNotifications = async (userId: string | undefined, organizationId: string | null) => {
  if (!userId) return [];
  
  let query = supabase
    .from('notifications')
    .select('*');
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Notification[];
};

/**
 * Creates a new notification
 */
export const createNotification = async (
  userId: string | undefined,
  organizationId: string | null,
  notificationData: Omit<Notification, 'id' | 'created_at' | 'updated_at'>
) => {
  if (!userId) throw new Error('Authentication required');
  
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      organization_id: organizationId,
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
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (userId: string | undefined, id: string) => {
  if (!userId) throw new Error('Authentication required');
  
  const { data, error } = await supabase
    .from('notifications')
    .update({ status: 'read', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Marks all unread notifications as read
 */
export const markAllNotificationsAsRead = async (userId: string | undefined, organizationId: string | null) => {
  if (!userId) throw new Error('Authentication required');
  
  let query = supabase
    .from('notifications')
    .update({ status: 'read', updated_at: new Date().toISOString() })
    .eq('status', 'unread');
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query.select();
  
  if (error) throw error;
  return data;
};

/**
 * Deletes a notification
 */
export const deleteNotification = async (userId: string | undefined, id: string) => {
  if (!userId) throw new Error('Authentication required');
  
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return id;
};

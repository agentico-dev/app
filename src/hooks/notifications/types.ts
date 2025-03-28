
import { Notification } from '@/types/application';

export interface UseNotificationsResult {
  notifications: Notification[];
  unreadNotifications: Notification[];
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  createNotification: ReturnType<typeof import('@tanstack/react-query')['useMutation']>;
  markAsRead: ReturnType<typeof import('@tanstack/react-query')['useMutation']>;
  markAllAsRead: ReturnType<typeof import('@tanstack/react-query')['useMutation']>;
  deleteNotification: ReturnType<typeof import('@tanstack/react-query')['useMutation']>;
  refetch: () => Promise<any>;
  selectedOrgId: string | null;
}

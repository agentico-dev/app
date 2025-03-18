
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { format, formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useApplicationMessages } from '@/hooks/useApplicationMessages';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router';
import { ApplicationMessage } from '@/types/application';

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch all unread messages across all applications
  const { 
    data: notifications = [], 
    isLoading,
    markAsRead
  } = useApplicationMessages();

  const unreadNotifications = notifications.filter(notification => notification.status === 'unread');
  const unreadCount = unreadNotifications.length;

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error('Authentication required');
      
      // Update all unread notifications to read
      const promises = unreadNotifications.map(notification => 
        markAsRead.mutateAsync(notification.id)
      );
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-messages'] });
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />;
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />;
      case 'error':
        return <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
    }
  };

  const navigateToMessage = (message: ApplicationMessage) => {
    if (message.application_id) {
      if (message.api_id) {
        navigate(`/applications/${message.application_id}/apis/${message.api_id}?tab=messages`);
      } else {
        navigate(`/applications/${message.application_id}`);
      }
      
      // Mark as read when navigating
      if (message.status === 'unread') {
        markAsRead.mutate(message.id);
      }
      
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open && unreadCount > 0) {
      // Auto-mark as read after a delay when opening
      const timer = setTimeout(() => {
        markAllAsRead.mutate();
      }, 5000); // 5 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, [open, unreadCount]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${notification.status === 'read' ? 'opacity-60' : ''}`}
                  onClick={() => navigateToMessage(notification)}
                >
                  <div className="flex">
                    {getNotificationIcon(notification.message_type || 'info')}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.created_at && 
                          formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

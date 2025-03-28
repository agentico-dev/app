
import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router';
import { useNotifications } from '@/hooks/notifications';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use the new notifications hook
  const { 
    notifications = [], 
    unreadNotifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    isAuthenticated
  } = useNotifications();

  const unreadCount = unreadNotifications?.length || 0;

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

  const navigateToResource = (notification: any) => {
    if (!notification.resource_id) return;
    
    let url = '';
    
    switch (notification.resource_type) {
      case 'project':
        url = `/projects/${notification.resource_id}`;
        break;
      case 'application':
        url = `/applications/${notification.resource_id}`;
        break;
      case 'server':
        url = `/servers/${notification.resource_id}`;
        break;
      case 'tool':
        url = `/ai-tools/${notification.resource_id}`;
        break;
      case 'api':
        if (notification.related_resource_id) {
          url = `/applications/${notification.related_resource_id}/apis/${notification.resource_id}`;
        }
        break;
      case 'service':
        if (notification.related_resource_id) {
          url = `/applications/${notification.related_resource_id}/services/${notification.resource_id}`;
        }
        break;
      default:
        console.warn(`Unknown resource type: ${notification.resource_type}`);
        return;
    }
    
    // Mark as read when navigating
    if (notification.status === 'unread') {
      markAsRead.mutate(notification.id);
    }
    
    navigate(url);
    setOpen(false);
  };

  useEffect(() => {
    if (open && unreadCount > 0) {
      // Auto-mark as read after a delay when opening
      const timer = setTimeout(() => {
        markAllAsRead.mutate({});
      }, 5000); // 5 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, [open, unreadCount, markAllAsRead]);

  if (!isAuthenticated) {
    return null;
  }

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
              onClick={() => markAllAsRead.mutate({})}
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
                  onClick={() => navigateToResource(notification)}
                >
                  <div className="flex">
                    {getNotificationIcon(notification.notification_type)}
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

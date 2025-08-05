import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { usePosts } from '@/context/PostContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationAsRead, getUnreadNotifications } = usePosts();
  const unreadCount = getUnreadNotifications();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👥';
      case 'mention': return '@';
      default: return '🔔';
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-bounce-subtle"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <Card className="absolute top-full right-0 mt-2 w-80 shadow-hover border-border z-50 animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-display">Notifications</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-3 hover:bg-accent/50 cursor-pointer transition-colors border-l-2 ${
                          notification.read 
                            ? 'border-transparent opacity-60' 
                            : 'border-primary bg-primary/5'
                        }`}
                      >
                        <div className="flex space-x-3">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                                {getInitials(notification.fromUserName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 text-xs">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              <span className="font-medium">{notification.fromUserName}</span>
                              {' '}{notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
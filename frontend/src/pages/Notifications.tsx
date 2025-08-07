import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle, 
  Trophy, 
  BookOpen, 
  Play,
  Trash2,
  Check
} from "lucide-react";
import { getCurrentUser } from "@/utils/userAuth";
import { 
  loadNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  Notification 
} from "@/utils/notificationManager";
import { Navigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      loadNotificationsData();
    }
  }, [currentUser]);

  const loadNotificationsData = () => {
    if (currentUser) {
      const userNotifications = loadNotifications(currentUser.id);
      // Sort by creation date (newest first)
      const sortedNotifications = userNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotificationsData();
  };

  const handleMarkAllAsRead = () => {
    if (currentUser) {
      markAllNotificationsAsRead(currentUser.id);
      loadNotificationsData();
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    loadNotificationsData();
  };

  const handleClearAll = () => {
    if (currentUser) {
      clearAllNotifications(currentUser.id);
      loadNotificationsData();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course_enrolled':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'video_completed':
        return <Play className="w-5 h-5 text-green-500" />;
      case 'course_completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'achievement_unlocked':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Notifications</h1>
                <p className="text-platform-gray-dark">
                  Stay updated with your learning progress
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="mr-2">
                    {unreadCount} unread
                  </Badge>
                )}
                {notifications.length > 0 && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearAll}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-platform-gray rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-platform-gray-dark" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    No Notifications Yet
                  </h3>
                  <p className="text-platform-gray-dark">
                    Start learning and you'll see notifications about your progress here!
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`card-elevated transition-all duration-200 ${
                    notification.read ? 'opacity-70' : 'border-primary/20'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium ${
                            notification.read ? 'text-platform-gray-dark' : 'text-primary'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-platform-gray-dark">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        
                        <p className={`text-sm ${
                          notification.read ? 'text-platform-gray-dark' : 'text-platform-gray-dark'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Badge variant="outline" className="text-xs">
                                New
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs capitalize">
                              {notification.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
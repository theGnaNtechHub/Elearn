export interface Notification {
  id: string;
  type: 'course_enrolled' | 'video_completed' | 'course_completed' | 'achievement_unlocked' | 'general';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: string;
}

// Load notifications from localStorage
export const loadNotifications = (userId?: string): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem('vteach_notifications');
    const allNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
    if (userId) {
      return allNotifications.filter((n: Notification) => n.userId === userId);
    }
    
    return allNotifications;
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};

// Save notifications to localStorage
export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem('vteach_notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

// Add new notification
export const addNotification = (notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification => {
  const notifications = loadNotifications();
  const newNotification: Notification = {
    ...notificationData,
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.push(newNotification);
  saveNotifications(notifications);
  return newNotification;
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = loadNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.read = true;
    saveNotifications(notifications);
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = (userId: string): void => {
  const notifications = loadNotifications();
  const updated = notifications.map(n => 
    n.userId === userId ? { ...n, read: true } : n
  );
  saveNotifications(updated);
};

// Get unread notifications count
export const getUnreadNotificationsCount = (userId: string): number => {
  const notifications = loadNotifications(userId);
  return notifications.filter(n => !n.read).length;
};

// Delete notification
export const deleteNotification = (notificationId: string): void => {
  const notifications = loadNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  saveNotifications(filtered);
};

// Clear all notifications for a user
export const clearAllNotifications = (userId: string): void => {
  const notifications = loadNotifications();
  const filtered = notifications.filter(n => n.userId !== userId);
  saveNotifications(filtered);
};
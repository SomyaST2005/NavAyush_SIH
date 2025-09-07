import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Mock notifications for development
  const mockNotifications = [
    {
      id: 1,
      title: 'Appointment Reminder',
      message: 'Your Abhyanga session is scheduled for tomorrow at 10:00 AM',
      type: 'appointment',
      isRead: false,
      createdAt: '2025-01-14T18:00:00Z',
      actionUrl: '/appointments/1'
    },
    {
      id: 2,
      title: 'Treatment Progress',
      message: 'Congratulations! You have completed 65% of your Panchakarma treatment',
      type: 'success',
      isRead: false,
      createdAt: '2025-01-14T12:00:00Z',
      actionUrl: '/progress'
    },
    {
      id: 3,
      title: 'Dietary Guidelines',
      message: 'New dietary recommendations have been added to your treatment plan',
      type: 'info',
      isRead: true,
      createdAt: '2025-01-13T15:30:00Z',
      actionUrl: '/diet-plan'
    },
    {
      id: 4,
      title: 'Preparation Reminder',
      message: 'Please avoid heavy meals 2 hours before your Shirodhara session',
      type: 'reminder',
      isRead: false,
      createdAt: '2025-01-13T09:00:00Z',
      actionUrl: '/appointments/2'
    },
    {
      id: 5,
      title: 'Milestone Achievement',
      message: 'You have reached the midpoint of your treatment journey!',
      type: 'success',
      isRead: true,
      createdAt: '2025-01-12T16:45:00Z',
      actionUrl: '/milestones'
    },
    {
      id: 6,
      title: 'Session Feedback',
      message: 'Please provide feedback for your recent Abhyanga session',
      type: 'info',
      isRead: true,
      createdAt: '2025-01-11T20:00:00Z',
      actionUrl: '/feedback/1'
    }
  ];

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, this would be actual API calls
      // const response = await api.get('/notifications');
      // setNotifications(response.data);
      
      // For now, use mock data
      setTimeout(() => {
        setNotifications(mockNotifications);
        const unread = mockNotifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // In production:
      // await api.put(`/notifications/${notificationId}/read`);
      
      // Mock implementation
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      // In production:
      // await api.put('/notifications/mark-all-read');
      
      // Mock implementation
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
      throw err;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // In production:
      // await api.delete(`/notifications/${notificationId}`);
      
      // Mock implementation
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
    } catch (err) {
      setError(err.message || 'Failed to delete notification');
      throw err;
    }
  };

  const sendNotification = async (notificationData) => {
    try {
      // In production:
      // const response = await api.post('/notifications', notificationData);
      // const newNotification = response.data;
      
      // Mock implementation
      const newNotification = {
        id: Date.now(),
        ...notificationData,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      return newNotification;
    } catch (err) {
      setError(err.message || 'Failed to send notification');
      throw err;
    }
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.isRead);
  };

  const getRecentNotifications = (limit = 5) => {
    return notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // WebSocket connection for real-time notifications (mock implementation)
  useEffect(() => {
    if (!user) return;

    // In production, this would establish a WebSocket connection
    // const ws = new WebSocket(`ws://localhost:3001/notifications?userId=${user.id}`);
    // 
    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   setNotifications(prev => [notification, ...prev]);
    //   setUnreadCount(prev => prev + 1);
    // };
    // 
    // return () => ws.close();

    // Mock real-time notification simulation
    const interval = setInterval(() => {
      // Randomly add a new notification (for demo purposes)
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const mockNewNotification = {
          id: Date.now(),
          title: 'New Update',
          message: 'You have a new update in your treatment plan',
          type: 'info',
          isRead: false,
          createdAt: new Date().toISOString(),
          actionUrl: '/dashboard'
        };
        
        setNotifications(prev => [mockNewNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    getNotificationsByType,
    getUnreadNotifications,
    getRecentNotifications,
    refetch: fetchNotifications
  };
};

import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationStyles = (type, isRead) => {
    const baseStyles = isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200';
    
    switch (type) {
      case 'appointment':
        return `${baseStyles} ${!isRead ? 'bg-blue-50' : ''}`;
      case 'reminder':
        return `${baseStyles} ${!isRead ? 'bg-yellow-50' : ''}`;
      case 'success':
        return `${baseStyles} ${!isRead ? 'bg-green-50' : ''}`;
      case 'warning':
        return `${baseStyles} ${!isRead ? 'bg-orange-50' : ''}`;
      default:
        return baseStyles;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'appointments') return notification.type === 'appointment';
    return true;
  }) || [];

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Handle notification action based on type
    if (notification.actionUrl) {
      // Navigate to specific page or perform action
      // TODO: Implement navigation to notification.actionUrl
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  className={`flex-1 py-1 px-2 rounded-md text-xs font-medium transition-colors ${
                    filter === 'appointments'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setFilter('appointments')}
                >
                  Appointments
                </button>
              </div>
              
              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4">
                  <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex space-x-3">
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        getNotificationStyles(notification.type, notification.isRead)
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                notification.isRead ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mt-1 ${
                                notification.isRead ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="flex-shrink-0 ml-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;

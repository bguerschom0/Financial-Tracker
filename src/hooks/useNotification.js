// src/hooks/useNotification.jsx
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    
    const newNotification = {
      id,
      message,
      type, // 'info', 'success', 'warning', 'error'
      duration
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification display component */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-md shadow-lg max-w-sm transform transition-all duration-300 ease-in-out ${
                notification.type === 'success' ? 'bg-green-100 border-green-400' :
                notification.type === 'error' ? 'bg-red-100 border-red-400' :
                notification.type === 'warning' ? 'bg-yellow-100 border-yellow-400' :
                'bg-blue-100 border-blue-400'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-grow">
                  <p className={`text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className={`ml-4 text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-500 hover:text-green-700' :
                    notification.type === 'error' ? 'text-red-500 hover:text-red-700' :
                    notification.type === 'warning' ? 'text-yellow-500 hover:text-yellow-700' :
                    'text-blue-500 hover:text-blue-700'
                  }`}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

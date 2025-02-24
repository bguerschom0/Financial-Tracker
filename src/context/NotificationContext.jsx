// src/context/NotificationContext.jsx
import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(note => note.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Mobile-friendly notifications container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 space-y-2 pointer-events-none
                    sm:top-0 sm:bottom-auto sm:right-0 sm:left-auto sm:w-96">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`rounded-lg p-4 shadow-lg pointer-events-auto
                      transition-all duration-300 transform translate-y-0
                      ${notification.type === 'error' ? 'bg-red-500 text-white' :
                        notification.type === 'success' ? 'bg-green-500 text-white' :
                        'bg-blue-500 text-white'}`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

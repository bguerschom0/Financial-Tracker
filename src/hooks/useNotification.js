// src/hooks/useNotification.js
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook to access and manage notifications
 * 
 * @returns {Object} The notification context containing:
 *   - notifications: Array of current notifications
 *   - addNotification: Function to add a new notification
 *   - removeNotification: Function to remove a notification by ID
 *   - clearNotifications: Function to clear all notifications
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default useNotification;

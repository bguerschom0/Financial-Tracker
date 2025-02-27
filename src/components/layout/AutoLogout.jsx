// src/components/layout/AutoLogout.jsx
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

// Timeout duration in milliseconds (5 minutes = 300,000ms)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;
let inactivityTimer;

const AutoLogout = () => {
  const { signOut } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Function to reset the timer
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      inactivityTimer = setTimeout(() => {
        // Perform logout
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    // Function to handle the logout
    const handleLogout = async () => {
      try {
        await signOut();
        addNotification('You have been logged out due to inactivity', 'info');
      } catch (error) {
        console.error('Error during auto-logout:', error);
      }
    };

    // Events that reset the timer
    const events = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'click'
    ];
    
    // Set up initial timer
    resetTimer();
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Cleanup
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [signOut, addNotification]);

  // This component doesn't render anything
  return null;
};

export default AutoLogout;

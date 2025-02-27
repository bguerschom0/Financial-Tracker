// src/hooks/useAuth.js
import React, { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
    
    // Subscribe to auth state changes
    const { unsubscribe } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Sign up
  const signUp = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await auth.signUp(data);
      return result;
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const signIn = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: authUser } = await auth.signIn(credentials);
      setUser(authUser);
      return authUser;
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    if (user && userData) {
      // Update local user state
      setUser(prev => ({
        ...prev,
        ...userData
      }));
      
      // Update localStorage user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({
            ...parsedUser,
            ...userData
          }));
        } catch (err) {
          console.error('Error updating stored user data:', err);
        }
      }
    }
  };

  // Using React.createElement instead of JSX
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        updateUser
      }
    },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

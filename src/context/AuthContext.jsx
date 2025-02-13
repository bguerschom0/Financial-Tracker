// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../lib/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const session = await auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

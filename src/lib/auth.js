// src/lib/auth.js
import { supabase, TABLES } from './supabase';

export const auth = {
  // Sign up new user
  async signUp({ username, password, full_name }) {
    try {
      // First, check if username exists
      const { data: existingUser, error: checkError } = await supabase
        .from(TABLES.USERS)
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingUser) {
        throw new Error('Username already exists');
      }
      
      // Insert new user into Fusers table
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([{
          username,
          password_hash: password, // In production, you should hash this password
          full_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      
      // Create session
      if (data && data[0]) {
        const sessionToken = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15);
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
        
        await supabase
          .from(TABLES.SESSIONS)
          .insert([{
            user_id: data[0].id,
            token: sessionToken,
            expires_at: expiresAt.toISOString(),
            ip_address: '127.0.0.1', // In production, get real IP
            user_agent: navigator.userAgent
          }]);
        
        // Save session in localStorage
        localStorage.setItem('session_token', sessionToken);
        localStorage.setItem('user', JSON.stringify(data[0]));
      }
      
      return data;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  },
  
  // Sign in existing user
  async signIn({ username, password }) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('username', username)
        .eq('password_hash', password) // In production, verify hash properly
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Invalid username or password');
      
      // Create session
      const sessionToken = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
      
      await supabase
        .from(TABLES.SESSIONS)
        .insert([{
          user_id: data.id,
          token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        }]);
      
      // Update last login timestamp
      await supabase
        .from(TABLES.USERS)
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);
      
      // Save session in localStorage
      localStorage.setItem('session_token', sessionToken);
      localStorage.setItem('user', JSON.stringify(data));
      
      return { user: data, session: { token: sessionToken } };
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  },
  
  // Sign out
  async signOut() {
    try {
      const sessionToken = localStorage.getItem('session_token');
      
      if (sessionToken) {
        // Delete session from database
        await supabase
          .from(TABLES.SESSIONS)
          .delete()
          .eq('token', sessionToken);
        
        // Clear local storage
        localStorage.removeItem('session_token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  },
  
  // Get current user
  async getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      const sessionToken = localStorage.getItem('session_token');
      
      if (!user || !sessionToken) return null;
      
      // Verify session is valid
      const { data, error } = await supabase
        .from(TABLES.SESSIONS)
        .select('*')
        .eq('token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        // Session invalid or expired
        localStorage.removeItem('session_token');
        localStorage.removeItem('user');
        return null;
      }
      
      return JSON.parse(user);
    } catch (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }
  },
  
  // Get session
  async getSession() {
    try {
      const sessionToken = localStorage.getItem('session_token');
      const user = localStorage.getItem('user');
      
      if (!sessionToken || !user) return null;
      
      // Verify session is valid
      const { data, error } = await supabase
        .from(TABLES.SESSIONS)
        .select('*')
        .eq('token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        // Session invalid or expired
        localStorage.removeItem('session_token');
        localStorage.removeItem('user');
        return null;
      }
      
      return {
        user: JSON.parse(user),
        token: sessionToken
      };
    } catch (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
  },
  
  // Subscribe to auth changes - simulated since we're using custom auth
  onAuthStateChange(callback) {
    // This is a simplified version for the custom auth system
    // You might want to implement a proper event system in a real application
    const checkInterval = setInterval(async () => {
      const session = await this.getSession();
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    }, 30000); // Check every 30 seconds
    
    return {
      unsubscribe: () => clearInterval(checkInterval)
    };
  }
};

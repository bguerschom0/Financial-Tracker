// src/lib/auth.js
import { supabase, TABLES } from './supabase';
import bcrypt from 'bcryptjs'; // You'll need to install this package: npm install bcryptjs

export const auth = {
  // Sign up new user
async signUp({ username, password, full_name }) {
  try {
    console.log("Starting signup process for:", username);
    
    // First, check if username exists
    const { data: existingUser, error: checkError } = await supabase
      .from(TABLES.USERS)
      .select('username')
      .eq('username', username)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is not found
      console.error("Error checking existing user:", checkError);
      throw new Error(`Error checking username: ${checkError.message}`);
    }
    
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully");
    
    // Insert new user into Fusers table
    console.log("Attempting to insert user into database");
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([{
        username,
        password_hash: hashedPassword,
        full_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.error("No data returned after insert");
      throw new Error("User creation failed");
    }
    
    console.log("User created successfully:", data[0].id);
    
    // Create session
    try {
      const sessionToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
      
      const { error: sessionError } = await supabase
        .from(TABLES.SESSIONS)
        .insert([{
          user_id: data[0].id,
          token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        }]);
      
      if (sessionError) {
        console.error("Session creation error:", sessionError);
        // Continue despite session error
      } else {
        // Save session in localStorage
        localStorage.setItem('session_token', sessionToken);
        localStorage.setItem('user', JSON.stringify(data[0]));
        console.log("Session created successfully");
      }
    } catch (sessionErr) {
      console.error("Error in session creation:", sessionErr);
      // Continue despite session error
    }
    
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
},
  
  // Sign in existing user
  async signIn({ username, password }) {
    try {
      // Get user record
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      if (!user) throw new Error('Invalid username or password');
      
      // Verify password with bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Invalid username or password');
      }
      
      // Create session
      const sessionToken = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
      
      await supabase
        .from(TABLES.SESSIONS)
        .insert([{
          user_id: user.id,
          token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        }]);
      
      // Update last login timestamp
      await supabase
        .from(TABLES.USERS)
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);
      
      // Save session in localStorage
      localStorage.setItem('session_token', sessionToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, session: { token: sessionToken } };
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

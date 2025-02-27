// src/lib/api.js - Enhanced with caching to prevent redundant API calls
import { supabase, TABLES } from './supabase';

// Simple in-memory cache system
const cache = {
  data: {}, // Cache storage
  timestamp: {}, // When data was cached
  ttl: 60000, // Cache lifetime in ms (1 minute)
  
  // Get cache data with key
  get(key) {
    const now = Date.now();
    const timestamp = this.timestamp[key] || 0;
    
    // Check if cache is still valid
    if (timestamp && now - timestamp < this.ttl) {
      return this.data[key];
    }
    
    return null; // Cache miss or expired
  },
  
  // Set cache data with key
  set(key, data) {
    this.data[key] = data;
    this.timestamp[key] = Date.now();
  },
  
  // Invalidate cache for a key
  invalidate(key) {
    delete this.data[key];
    delete this.timestamp[key];
  },
  
  // Invalidate all cache
  invalidateAll() {
    this.data = {};
    this.timestamp = {};
  }
};

export const api = {
  // Transactions
  async createTransaction(data) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const transactionData = {
      ...data,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: transaction, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .insert([transactionData])
      .select()
      .single();
      
    if (error) throw error;
    
    // Invalidate transaction cache since we added a new transaction
    cache.invalidate('transactions');
    
    return transaction;
  },
  
  async getTransactions(filters = {}) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    // Create a cache key based on filters
    const cacheKey = `transactions:${user.id}:${JSON.stringify(filters)}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from API
    let query = supabase
      .from(TABLES.TRANSACTIONS)
      .select('*')
      .eq('user_id', user.id);
      
    // Apply filters
    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    
    // Cache the results
    cache.set(cacheKey, data);
    
    return data;
  },
  
  async updateTransaction(id, data) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { data: transaction, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // Security check
      .select()
      .single();
      
    if (error) throw error;
    
    // Invalidate transaction cache since we updated a transaction
    cache.invalidateAll();
    
    return transaction;
  },
  
  async deleteTransaction(id) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Security check
      
    if (error) throw error;
    
    // Invalidate transaction cache since we deleted a transaction
    cache.invalidateAll();
  },
  
  // Debts
  async getDebts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    // Create a cache key for debts
    const cacheKey = `debts:${user.id}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const { data, error } = await supabase
      .from(TABLES.DEBTS)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Cache the results
    cache.set(cacheKey, data || []);
    
    return data || [];
  },
  
  // Savings
  async getSavings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    // Create a cache key for savings
    const cacheKey = `savings:${user.id}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const { data, error } = await supabase
      .from(TABLES.SAVINGS)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Cache the results
    cache.set(cacheKey, data || []);
    
    return data || [];
  },
  
  // User Profile
  async updateProfile(data) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { data: updatedUser, error } = await supabase
      .from(TABLES.USERS)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update local storage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Invalidate user profile cache
    cache.invalidate('profile');
    
    return updatedUser;
  },
  
  async getProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    // Create a cache key for profile
    const cacheKey = 'profile';
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    
    // Update local storage with latest data
    localStorage.setItem('user', JSON.stringify(data));
    
    // Cache the results
    cache.set(cacheKey, data);
    
    return data;
  },
  
  // User Settings
  async getSettings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    // Create a cache key for settings
    const cacheKey = `settings:${user.id}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw error;
    }
    
    // If no settings exist, create default settings
    if (!data) {
      const defaultSettings = {
        user_id: user.id,
        email_alerts: true,
        budget_alerts: true,
        bill_reminders: true,
        savings_updates: true,
        monthly_reports: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: newSettings, error: insertError } = await supabase
        .from(TABLES.SETTINGS)
        .insert([defaultSettings])
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Cache the results
      cache.set(cacheKey, newSettings);
      
      return newSettings;
    }
    
    // Cache the results
    cache.set(cacheKey, data);
    
    return data;
  },
  
  async updateSettings(settings) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Invalidate settings cache
    cache.invalidate(`settings:${user.id}`);
    
    return data;
  }
};

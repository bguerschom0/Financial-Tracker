// src/lib/api.js
import { supabase, TABLES } from './supabase';

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
    return transaction;
  },
  
  async getTransactions(filters = {}) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
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
  },
  
  // Budgets
  async createBudget(data) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const budgetData = {
      ...data,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: budget, error } = await supabase
      .from(TABLES.BUDGETS)
      .insert([budgetData])
      .select()
      .single();
      
    if (error) throw error;
    return budget;
  },
  
  async getBudgets(period = 'monthly') {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from(TABLES.BUDGETS)
      .select('*')
      .eq('user_id', user.id)
      .eq('period', period);
      
    if (error) throw error;
    return data;
  },
  
  async updateBudget(id, data) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { data: budget, error } = await supabase
      .from(TABLES.BUDGETS)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // Security check
      .select()
      .single();
      
    if (error) throw error;
    return budget;
  },
  
  async deleteBudget(id) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from(TABLES.BUDGETS)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Security check
      
    if (error) throw error;
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
    
    return updatedUser;
  },
  
  async getProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    
    // Update local storage with latest data
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
  },
  
  // User Settings
  async getSettings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      throw new Error('User not authenticated');
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
      return newSettings;
    }
    
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
    return data;
  }
};

// src/lib/api.js
import { supabase } from './supabase';

export const api = {
  // Transactions
  async createTransaction(data) {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return transaction;
  },

  async getTransactions(filters = {}) {
    let query = supabase
      .from('transactions')
      .select('*');

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
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transaction;
  },

  async deleteTransaction(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Budgets
  async createBudget(data) {
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return budget;
  },

  async getBudgets(period = 'monthly') {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('period', period);

    if (error) throw error;
    return data;
  },

  async updateBudget(id, data) {
    const { data: budget, error } = await supabase
      .from('budgets')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return budget;
  },

  async deleteBudget(id) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // User Profile
  async updateProfile(data) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(data)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async getProfile() {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) throw error;
    return profile;
  }
};


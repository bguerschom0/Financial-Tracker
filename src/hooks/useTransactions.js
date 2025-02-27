// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { useNotification } from './useNotification';
import { useAuth } from './useAuth';

export const useTransactions = ({ type, startDate, endDate } = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  // Function to fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Start building the query
      let query = supabase
        .from(TABLES.TRANSACTIONS)
        .select('*')
        .eq('user_id', user.id);
      
      // Add filters
      if (type) {
        query = query.eq('type', type);
      }
      
      if (startDate) {
        query = query.gte('date', startDate);
      }
      
      if (endDate) {
        query = query.lte('date', endDate);
      }
      
      // Execute the query
      const { data, error: supabaseError } = await query.order('date', { ascending: false });
      
      if (supabaseError) {
        console.error('Error fetching transactions:', supabaseError);
        setError(supabaseError.message);
        addNotification(`Error fetching transactions: ${supabaseError.message}`, 'error');
        return;
      }
      
      setTransactions(data || []);
    } catch (err) {
      console.error('Error in transaction fetch:', err);
      setError(err.message);
      addNotification(`Unexpected error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [user, type, startDate, endDate, addNotification]);

  // Load transactions on component mount and when dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Add a new transaction
  const addTransaction = async (transactionData) => {
    if (!user) {
      addNotification('You must be logged in to add transactions', 'error');
      return null;
    }

    try {
      const newTransaction = {
        ...transactionData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error: insertError } = await supabase
        .from(TABLES.TRANSACTIONS)
        .insert([newTransaction])
        .select();
      
      if (insertError) {
        console.error('Error adding transaction:', insertError);
        addNotification(`Failed to add transaction: ${insertError.message}`, 'error');
        return null;
      }
      
      // Update local state
      setTransactions(prev => [data[0], ...prev]);
      addNotification('Transaction added successfully', 'success');
      
      return data[0];
    } catch (err) {
      console.error('Error in addTransaction:', err);
      addNotification(`Unexpected error: ${err.message}`, 'error');
      return null;
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id, transactionData) => {
    if (!user) {
      addNotification('You must be logged in to update transactions', 'error');
      return null;
    }

    try {
      const updatedTransaction = {
        ...transactionData,
        updated_at: new Date().toISOString()
      };
      
      const { data, error: updateError } = await supabase
        .from(TABLES.TRANSACTIONS)
        .update(updatedTransaction)
        .eq('id', id)
        .eq('user_id', user.id) // Security check
        .select();
      
      if (updateError) {
        console.error('Error updating transaction:', updateError);
        addNotification(`Failed to update transaction: ${updateError.message}`, 'error');
        return null;
      }
      
      // Update local state
      setTransactions(prev => 
        prev.map(t => t.id === id ? data[0] : t)
      );
      
      addNotification('Transaction updated successfully', 'success');
      return data[0];
    } catch (err) {
      console.error('Error in updateTransaction:', err);
      addNotification(`Unexpected error: ${err.message}`, 'error');
      return null;
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    if (!user) {
      addNotification('You must be logged in to delete transactions', 'error');
      return false;
    }

    try {
      const { error: deleteError } = await supabase
        .from(TABLES.TRANSACTIONS)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Security check
      
      if (deleteError) {
        console.error('Error deleting transaction:', deleteError);
        addNotification(`Failed to delete transaction: ${deleteError.message}`, 'error');
        return false;
      }
      
      // Update local state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      addNotification('Transaction deleted successfully', 'success');
      return true;
    } catch (err) {
      console.error('Error in deleteTransaction:', err);
      addNotification(`Unexpected error: ${err.message}`, 'error');
      return false;
    }
  };

  // Refresh transactions on demand
  const refreshTransactions = fetchTransactions;

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions
  };
};

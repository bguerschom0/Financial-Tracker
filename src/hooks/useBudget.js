// src/hooks/useBudget.js
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export const useBudget = (period = 'monthly') => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const data = await api.getBudgets(period);
        setBudgets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [period]);

  return { budgets, loading, error };
};


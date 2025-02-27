// src/pages/savings/index.jsx
import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { supabase, TABLES } from '../../lib/supabase';
import { useNotification } from '../../hooks/useNotification';

const SavingsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [userCurrency, setUserCurrency] = useState('USD');
  const [progressData, setProgressData] = useState([]);

  // Load user's preferred currency
  useEffect(() => {
    if (user && user.currency) {
      setUserCurrency(user.currency);
    }
  }, [user]);

  // Load savings goals from the database
  const fetchSavingsGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from(TABLES.SAVINGS)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Format savings data and add progress calculation
      const formattedGoals = data.map(goal => {
        const progress = calculateProgress(goal.target_amount, goal.current_amount);
        return {
          ...goal,
          progress
        };
      });

      setSavingsGoals(formattedGoals);
      
      // Generate progress data for the chart (would normally come from historical data)
      generateProgressChartData();
      
    } catch (err) {
      console.error('Error fetching savings goals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = (targetAmount, currentAmount) => {
    if (!targetAmount || targetAmount <= 0) return 0;
    return Math.round((currentAmount / targetAmount) * 100);
  };

  // Generate mock historical progress data for the chart
  // In a real app, this would come from a separate table or API
  const generateProgressChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const mockData = [];
    
    // Start with a base value
    let runningTotal = 3000;
    
    for (let i = 0; i < months.length; i++) {
      // Add a random increase each month (between 5-15%)
      const increase = runningTotal * (0.05 + Math.random() * 0.1);
      runningTotal += increase;
      
      mockData.push({
        month: months[i],
        savings: Math.round(runningTotal)
      });
    }
    
    setProgressData(mockData);
  };

  // Load savings goals on component mount and when user changes
  useEffect(() => {
    fetchSavingsGoals();
  }, [user]);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    category: 'Emergency Fund',
    monthly_contribution: '',
    currency: userCurrency,
    notes: ''
  });

  // Reset form data when selectedGoal changes
  useEffect(() => {
    if (selectedGoal) {
      setFormData({
        name: selectedGoal.name || '',
        target_amount: selectedGoal.target_amount || '',
        current_amount: selectedGoal.current_amount || '',
        target_date: selectedGoal.target_date ? new Date(selectedGoal.target_date).toISOString().split('T')[0] : '',
        category: selectedGoal.category || 'Emergency Fund',
        monthly_contribution: selectedGoal.monthly_contribution || '',
        currency: selectedGoal.currency || userCurrency,
        notes: selectedGoal.notes || ''
      });
    } else {
      // Reset form for new goal
      setFormData({
        name: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        category: 'Emergency Fund',
        monthly_contribution: '',
        currency: userCurrency,
        notes: ''
      });
    }
  }, [selectedGoal, userCurrency]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.target_amount) errors.target_amount = 'Target amount is required';
    if (parseFloat(formData.target_amount) <= 0) errors.target_amount = 'Target amount must be greater than zero';
    if (!formData.current_amount && formData.current_amount !== 0) errors.current_amount = 'Current amount is required';
    if (parseFloat(formData.current_amount) < 0) errors.current_amount = 'Current amount cannot be negative';
    if (parseFloat(formData.current_amount) > parseFloat(formData.target_amount)) {
      errors.current_amount = 'Current amount cannot exceed target amount';
    }
    
    if (Object.keys(errors).length > 0) {
      // Show the first error
      addNotification(Object.values(errors)[0], 'error');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format data for submission
      const savingsData = {
        ...formData,
        user_id: user.id,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount),
        monthly_contribution: formData.monthly_contribution ? parseFloat(formData.monthly_contribution) : null,
        updated_at: new Date().toISOString()
      };
      
      if (selectedGoal) {
        // Update existing goal
        const { data, error: updateError } = await supabase
          .from(TABLES.SAVINGS)
          .update(savingsData)
          .eq('id', selectedGoal.id)
          .select();
          
        if (updateError) throw updateError;
        
        addNotification('Savings goal updated successfully', 'success');
      } else {
        // Create new goal
        const { data, error: insertError } = await supabase
          .from(TABLES.SAVINGS)
          .insert([{
            ...savingsData,
            created_at: new Date().toISOString()
          }])
          .select();
          
        if (insertError) throw insertError;
        
        addNotification('Savings goal added successfully', 'success');
      }
      
      // Close the form and refresh goals
      setShowAddForm(false);
      setSelectedGoal(null);
      fetchSavingsGoals();
      
    } catch (err) {
      console.error('Error saving goal:', err);
      addNotification(`Failed to save goal: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle goal deletion
  const handleDelete = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this savings goal?')) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error: deleteError } = await supabase
        .from(TABLES.SAVINGS)
        .delete()
        .eq('id', goalId);
        
      if (deleteError) throw deleteError;
      
      addNotification('Savings goal deleted successfully', 'success');
      fetchSavingsGoals();
      
    } catch (err) {
      console.error('Error deleting goal:', err);
      addNotification(`Failed to delete goal: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate totals
  const calculateTotalSavings = () => {
    return savingsGoals.reduce((total, goal) => total + (goal.current_amount || 0), 0);
  };

  const calculateMonthlyContributions = () => {
    return savingsGoals.reduce((total, goal) => total + (goal.monthly_contribution || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" className="mt-4">
        Error loading savings goals: {error}. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your savings goals
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="sm:self-start"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Total Savings</h3>
            <p className="text-3xl font-bold text-primary-600">
              {formatCurrency(calculateTotalSavings(), userCurrency)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Monthly Contributions</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(calculateMonthlyContributions(), userCurrency)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Active Goals</h3>
            <p className="text-3xl font-bold text-blue-600">{savingsGoals.length}</p>
          </div>
        </Card>
      </div>

      {/* Progress Chart */}
      {savingsGoals.length > 0 && progressData.length > 0 && (
        <Card title="Savings Progress">
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value, userCurrency)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10B981" 
                  name="Total Savings" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Savings Goals List */}
      <Card>
        {savingsGoals.length === 0 ? (
          <EmptyState
            title="No savings goals"
            description="Start by creating your first savings goal"
            icon={TrendingUp}
            action={
              <Button onClick={() => setShowAddForm(true)} disabled={isSubmitting}>
                <Plus className="h-5 w-5 mr-2" />
                Add Goal
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {savingsGoals.map((goal) => (
              <div 
                key={goal.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {goal.name}
                    </h4>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(goal.current_amount, goal.currency)} / {formatCurrency(goal.target_amount, goal.currency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {goal.target_date ? `Target date: ${formatDate(goal.target_date)}` : 'No target date'}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{goal.progress}% complete</span>
                    <span>Monthly contribution: {formatCurrency(goal.monthly_contribution || 0, goal.currency)}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowAddForm(true);
                    }}
                    disabled={isSubmitting}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(goal.id)}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddForm(false);
            setSelectedGoal(null);
          }
        }}
        title={selectedGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Goal Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Goal Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Emergency Fund, New Car, Vacation, etc."
                disabled={isSubmitting}
                required
              />
            </div>
            
            {/* Goal Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                disabled={isSubmitting}
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Retirement">Retirement</option>
                <option value="Education">Education</option>
                <option value="Home">Home</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Travel">Travel</option>
                <option value="Wedding">Wedding</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {/* Amount Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target Amount */}
              <div>
                <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700">
                  Target Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="target_amount"
                    name="target_amount"
                    value={formData.target_amount}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              
              {/* Current Amount */}
              <div>
                <label htmlFor="current_amount" className="block text-sm font-medium text-gray-700">
                  Current Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="current_amount"
                    name="current_amount"
                    value={formData.current_amount}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Monthly Contribution & Target Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monthly Contribution */}
              <div>
                <label htmlFor="monthly_contribution" className="block text-sm font-medium text-gray-700">
                  Monthly Contribution
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="monthly_contribution"
                    name="monthly_contribution"
                    value={formData.monthly_contribution}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              {/* Target Date */}
              <div>
                <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
                  Target Date
                </label>
                <input
                  type="date"
                  id="target_date"
                  name="target_date"
                  value={formData.target_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Currency */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                disabled={isSubmitting}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="RWF">RWF - Rwandan Franc</option>
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="ZAR">ZAR - South African Rand</option>
              </select>
            </div>
            
            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Additional information about this savings goal..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!isSubmitting) {
                  setShowAddForm(false);
                  setSelectedGoal(null);
                }
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              {selectedGoal ? 'Update Goal' : 'Add Goal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SavingsPage;

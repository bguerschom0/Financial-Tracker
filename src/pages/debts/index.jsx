// src/pages/debts/index.jsx
import React, { useState, useEffect } from 'react';
import { Plus, TrendingDown } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { supabase, TABLES } from '../../lib/supabase';
import { useNotification } from '../../hooks/useNotification';

const DebtsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [userCurrency, setUserCurrency] = useState('USD');

  // Load user's preferred currency
  useEffect(() => {
    if (user && user.currency) {
      setUserCurrency(user.currency);
    }
  }, [user]);

  // Load debts from the database
  const fetchDebts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from(TABLES.DEBTS)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Format debt data and add progress calculation
      const formattedDebts = data.map(debt => {
        const progress = calculateProgress(debt.total_amount, debt.remaining_amount);
        return {
          ...debt,
          progress
        };
      });

      setDebts(formattedDebts);
    } catch (err) {
      console.error('Error fetching debts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = (totalAmount, remainingAmount) => {
    if (!totalAmount || totalAmount <= 0) return 0;
    const paid = totalAmount - remainingAmount;
    return Math.round((paid / totalAmount) * 100);
  };

  // Load debts on component mount and when user changes
  useEffect(() => {
    fetchDebts();
  }, [user]);

  // Prepare data for chart
  const debtChartData = debts.map(debt => ({
    name: debt.name,
    remaining: debt.remaining_amount,
    paid: debt.total_amount - debt.remaining_amount
  }));

  // Calculate totals
  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.remaining_amount, 0);
  };

  const calculateMonthlyPayments = () => {
    return debts.reduce((total, debt) => total + (debt.minimum_payment || 0), 0);
  };

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    total_amount: '',
    remaining_amount: '',
    interest_rate: '',
    minimum_payment: '',
    due_date: '',
    type: 'Personal Loan',
    currency: userCurrency,
    notes: ''
  });

  // Reset form data when selectedDebt changes
  useEffect(() => {
    if (selectedDebt) {
      setFormData({
        name: selectedDebt.name || '',
        total_amount: selectedDebt.total_amount || '',
        remaining_amount: selectedDebt.remaining_amount || '',
        interest_rate: selectedDebt.interest_rate || '',
        minimum_payment: selectedDebt.minimum_payment || '',
        due_date: selectedDebt.due_date ? new Date(selectedDebt.due_date).toISOString().split('T')[0] : '',
        type: selectedDebt.type || 'Personal Loan',
        currency: selectedDebt.currency || userCurrency,
        notes: selectedDebt.notes || ''
      });
    } else {
      // Reset form for new debt
      setFormData({
        name: '',
        total_amount: '',
        remaining_amount: '',
        interest_rate: '',
        minimum_payment: '',
        due_date: '',
        type: 'Personal Loan',
        currency: userCurrency,
        notes: ''
      });
    }
  }, [selectedDebt, userCurrency]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.total_amount) errors.total_amount = 'Total amount is required';
    if (parseFloat(formData.total_amount) <= 0) errors.total_amount = 'Total amount must be greater than zero';
    if (!formData.remaining_amount) errors.remaining_amount = 'Remaining amount is required';
    if (parseFloat(formData.remaining_amount) < 0) errors.remaining_amount = 'Remaining amount cannot be negative';
    if (parseFloat(formData.remaining_amount) > parseFloat(formData.total_amount)) {
      errors.remaining_amount = 'Remaining amount cannot exceed total amount';
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
      const debtData = {
        ...formData,
        user_id: user.id,
        total_amount: parseFloat(formData.total_amount),
        remaining_amount: parseFloat(formData.remaining_amount),
        interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : null,
        minimum_payment: formData.minimum_payment ? parseFloat(formData.minimum_payment) : null,
        updated_at: new Date().toISOString()
      };
      
      if (selectedDebt) {
        // Update existing debt
        const { data, error: updateError } = await supabase
          .from(TABLES.DEBTS)
          .update(debtData)
          .eq('id', selectedDebt.id)
          .select();
          
        if (updateError) throw updateError;
        
        addNotification('Debt updated successfully', 'success');
      } else {
        // Create new debt
        const { data, error: insertError } = await supabase
          .from(TABLES.DEBTS)
          .insert([{
            ...debtData,
            created_at: new Date().toISOString()
          }])
          .select();
          
        if (insertError) throw insertError;
        
        addNotification('Debt added successfully', 'success');
      }
      
      // Close the form and refresh debts
      setShowAddForm(false);
      setSelectedDebt(null);
      fetchDebts();
      
    } catch (err) {
      console.error('Error saving debt:', err);
      addNotification(`Failed to save debt: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle debt deletion
  const handleDelete = async (debtId) => {
    if (!window.confirm('Are you sure you want to delete this debt?')) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error: deleteError } = await supabase
        .from(TABLES.DEBTS)
        .delete()
        .eq('id', debtId);
        
      if (deleteError) throw deleteError;
      
      addNotification('Debt deleted successfully', 'success');
      fetchDebts();
      
    } catch (err) {
      console.error('Error deleting debt:', err);
      addNotification(`Failed to delete debt: ${err.message}`, 'error');
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
        Error loading debts: {error}. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Debt Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your debts
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="sm:self-start"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Debt
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Total Debt</h3>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(calculateTotalDebt(), userCurrency)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Monthly Payments</h3>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(calculateMonthlyPayments(), userCurrency)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Active Debts</h3>
            <p className="text-3xl font-bold text-blue-600">{debts.length}</p>
          </div>
        </Card>
      </div>

      {/* Debt Progress Chart */}
      {debts.length > 0 && (
        <Card title="Debt Progress">
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={debtChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value, userCurrency)} />
                <Legend />
                <Bar 
                  dataKey="remaining" 
                  stackId="a" 
                  fill="#EF4444" 
                  name="Remaining" 
                />
                <Bar 
                  dataKey="paid" 
                  stackId="a" 
                  fill="#10B981" 
                  name="Paid" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Debts List */}
      <Card>
        {debts.length === 0 ? (
          <EmptyState
            title="No debts recorded"
            description="Add your debts to start tracking them"
            icon={TrendingDown}
            action={
              <Button onClick={() => setShowAddForm(true)} disabled={isSubmitting}>
                <Plus className="h-5 w-5 mr-2" />
                Add Debt
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {debts.map((debt) => (
              <div 
                key={debt.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {debt.name}
                      </h4>
                      <Badge variant="default">{debt.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {debt.interest_rate}% APR
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(debt.remaining_amount, debt.currency)} / {formatCurrency(debt.total_amount, debt.currency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {debt.due_date ? `Due: ${formatDate(debt.due_date)}` : 'No due date'}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${debt.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{debt.progress}% paid</span>
                    <span>Monthly: {formatCurrency(debt.minimum_payment || 0, debt.currency)}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedDebt(debt);
                      setShowAddForm(true);
                    }}
                    disabled={isSubmitting}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(debt.id)}
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
            setSelectedDebt(null);
          }
        }}
        title={selectedDebt ? 'Edit Debt' : 'Add New Debt'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Debt Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Debt Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Car Loan, Mortgage, Credit Card, etc."
                disabled={isSubmitting}
                required
              />
            </div>
            
            {/* Debt Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Debt Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                disabled={isSubmitting}
              >
                <option value="Auto Loan">Auto Loan</option>
                <option value="Mortgage">Mortgage</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Student Loan">Student Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Medical Debt">Medical Debt</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {/* Amount Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Amount */}
              <div>
                <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="total_amount"
                    name="total_amount"
                    value={formData.total_amount}
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
              
              {/* Remaining Amount */}
              <div>
                <label htmlFor="remaining_amount" className="block text-sm font-medium text-gray-700">
                  Remaining Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="remaining_amount"
                    name="remaining_amount"
                    value={formData.remaining_amount}
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
            
            {/* Interest Rate & Minimum Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Interest Rate */}
              <div>
                <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
                  Interest Rate (% APR)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="interest_rate"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              {/* Minimum Payment */}
              <div>
                <label htmlFor="minimum_payment" className="block text-sm font-medium text-gray-700">
                  Monthly Payment
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="minimum_payment"
                    name="minimum_payment"
                    value={formData.minimum_payment}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            
            {/* Currency & Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              {/* Due Date */}
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={isSubmitting}
                />
              </div>
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
                placeholder="Additional information about this debt..."
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
                  setSelectedDebt(null);
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
              {selectedDebt ? 'Update Debt' : 'Add Debt'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DebtsPage;

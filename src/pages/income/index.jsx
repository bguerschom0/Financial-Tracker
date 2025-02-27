// src/pages/income/index.jsx
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/formatting';
import TransactionForm from '../../components/forms/TransactionForm';
import { useAuth } from '../../hooks/useAuth';

const IncomePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [userCurrency, setUserCurrency] = useState('USD');
  
  // Use the hook with the specific type filter
  const { 
    transactions, 
    loading, 
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions
  } = useTransactions({ type: 'income' });

  // Get user's preferred currency
  useEffect(() => {
    if (user && user.currency) {
      setUserCurrency(user.currency);
    }
  }, [user]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Ensure amount is a number
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount),
        date: data.date || new Date().toISOString().split('T')[0],
        currency: data.currency || userCurrency // Include currency in transaction data
      };
      
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, formattedData);
      } else {
        await addTransaction({ ...formattedData, type: 'income' });
      }
      
      // Close modal and reset selected transaction
      setShowAddModal(false);
      setSelectedTransaction(null);
      
      // Refresh the transactions list
      refreshTransactions();
      
    } catch (err) {
      console.error('Error saving transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        setIsSubmitting(true);
        await deleteTransaction(id);
      } catch (err) {
        console.error('Error deleting transaction:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Calculate total income for current month
  const calculateMonthlyTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => {
        // If transaction has its own currency, we should ideally convert currencies
        // For simplicity, we're just summing as-is for now
        return sum + (parseFloat(t.amount) || 0);
      }, 0);
  };

  const totalIncome = transactions.length > 0 ? calculateMonthlyTotal() : 0;

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
        Error loading income data: {error}. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your income sources and transactions
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="sm:self-start"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-700">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalIncome, userCurrency)}
          </p>
          <p className="text-sm text-gray-500">Current Month ({userCurrency})</p>
        </div>
      </Card>

      {/* Transactions List */}
      <Card>
        {transactions.length === 0 ? (
          <EmptyState
            title="No income records"
            description="Start by adding your first income record"
            action={
              <Button onClick={() => setShowAddModal(true)} disabled={isSubmitting}>
                <Plus className="h-5 w-5 mr-2" />
                Add Income
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(
                        parseFloat(transaction.amount) || 0, 
                        transaction.currency || userCurrency
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isSubmitting}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedTransaction(null);
          }
        }}
        title={selectedTransaction ? 'Edit Income' : 'Add Income'}
      >
        <TransactionForm
          type="income"
          initialData={selectedTransaction}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedTransaction(null);
            }
          }}
          isSubmitting={isSubmitting}
          defaultCurrency={userCurrency}
        />
      </Modal>
    </div>
  );
};

export default IncomePage;

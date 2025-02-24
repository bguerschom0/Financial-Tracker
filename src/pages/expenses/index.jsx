// src/pages/expenses/index.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/formatting';
import TransactionForm from '../../components/forms/TransactionForm';

const ExpensesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { 
    transactions, 
    loading, 
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction 
  } = useTransactions({ type: 'expense' });

  const handleSubmit = async (data) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, data);
      } else {
        await addTransaction({ ...data, type: 'expense' });
      }
      setShowAddModal(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error('Error saving transaction:', err);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  // Calculate totals and categories
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const expensesByCategory = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (error) {
    return (
      <Alert type="error" className="mt-4">
        Error loading expense data. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your expenses
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="sm:self-start"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-gray-500">Current Month</p>
          </div>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700">By Category</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <Badge 
                  key={category}
                  variant="default"
                  className="text-sm"
                >
                  {category}: {formatCurrency(amount)}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        {transactions.length === 0 ? (
          <EmptyState
            title="No expenses recorded"
            description="Start tracking your expenses by adding your first record"
            action={
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Expense
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
                      <Badge variant="default">
                        {transaction.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
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
          setShowAddModal(false);
          setSelectedTransaction(null);
        }}
        title={selectedTransaction ? 'Edit Expense' : 'Add Expense'}
      >
        <TransactionForm
          type="expense"
          initialData={selectedTransaction}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedTransaction(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ExpensesPage;

// src/pages/income/index.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import  Card  from '../../components/ui/Card';
import  Button  from '../../components/ui/Button';
import  Modal  from '../../components/ui/Modal';
import  LoadingSpinner  from '../../components/ui/LoadingSpinner';
import  Alert  from '../../components/ui/Alert';
import  EmptyState  from '../../components/ui/EmptyState';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/formatting';
import TransactionForm from '../../components/forms/TransactionForm';

const IncomePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { 
    transactions, 
    loading, 
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction 
  } = useTransactions({ type: 'income' });

  const handleSubmit = async (data) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, data);
      } else {
        await addTransaction({ ...data, type: 'income' });
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
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (error) {
    return (
      <Alert type="error" className="mt-4">
        Error loading income data. Please try again later.
      </Alert>
    );
  }

  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);

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
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-sm text-gray-500">Current Month</p>
        </div>
      </Card>

      {/* Transactions List */}
      <Card>
        {transactions.length === 0 ? (
          <EmptyState
            title="No income records"
            description="Start by adding your first income record"
            action={
              <Button onClick={() => setShowAddModal(true)}>
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
        title={selectedTransaction ? 'Edit Income' : 'Add Income'}
      >
        <TransactionForm
          type="income"
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

export default IncomePage;

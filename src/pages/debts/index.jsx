// src/pages/debts/index.jsx
import React, { useState } from 'react';
import { Plus, TrendingDown } from 'lucide-react';
import  Card  from '../../components/ui/Card';
import  Button  from '../../components/ui/Button';
import  Modal  from '../../components/ui/Modal';
import  Badge  from '../../components/ui/Badge';
import  LoadingSpinner  from '../../components/ui/LoadingSpinner';
import  Alert  from '../../components/ui/Alert';
import  EmptyState  from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DebtsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  // Sample data - replace with actual API calls
  const debts = [
    {
      id: 1,
      name: 'Car Loan',
      totalAmount: 25000,
      remainingAmount: 18000,
      interestRate: 4.5,
      minimumPayment: 450,
      dueDate: '2025-02-15',
      type: 'Auto Loan',
      progress: 28
    },
    // ... other debts
  ];

  const debtChartData = debts.map(debt => ({
    name: debt.name,
    remaining: debt.remainingAmount,
    paid: debt.totalAmount - debt.remainingAmount
  }));

  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.remainingAmount, 0);
  };

  const calculateMonthlyPayments = () => {
    return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
  };

  const handleSubmit = (formData) => {
    // Handle form submission
    setShowAddForm(false);
    setSelectedDebt(null);
  };

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
              {formatCurrency(calculateTotalDebt())}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Monthly Payments</h3>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(calculateMonthlyPayments())}
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
      <Card title="Debt Progress">
        <div className="h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={debtChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
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

      {/* Debts List */}
      <Card>
        {debts.length === 0 ? (
          <EmptyState
            title="No debts recorded"
            description="Add your debts to start tracking them"
            icon={TrendingDown}
            action={
              <Button onClick={() => setShowAddForm(true)}>
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
                      {debt.interestRate}% APR
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(debt.remainingAmount)} / {formatCurrency(debt.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {formatDate(debt.dueDate)}
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
                    <span>Monthly: {formatCurrency(debt.minimumPayment)}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedDebt(debt)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
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
          setShowAddForm(false);
          setSelectedDebt(null);
        }}
        title={selectedDebt ? 'Edit Debt' : 'Add New Debt'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form content will go here */}
        </form>
      </Modal>
    </div>
  );
};

export default DebtsPage;

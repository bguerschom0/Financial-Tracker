// src/pages/savings/index.jsx
import React, { useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import  Card  from '../../components/ui/Card';
import  Button  from '../../components/ui/Button';
import  Modal  from '../../components/ui/Modal';
import  LoadingSpinner  from '../../components/ui/LoadingSpinner';
import  Alert  from '../../components/ui/Alert';
import  EmptyState  from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SavingsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Sample data - replace with actual API calls
  const savingsGoals = [
    {
      id: 1,
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 5500,
      targetDate: '2025-12-31',
      category: 'Emergency',
      monthlyContribution: 500,
      progress: 55
    },
    // ... other goals
  ];

  // Progress data
  const progressData = [
    { month: 'Jan', savings: 4200 },
    { month: 'Feb', savings: 4800 },
    { month: 'Mar', savings: 5500 },
  ];

  const handleSubmit = (formData) => {
    // Handle form submission
    setShowAddForm(false);
    setSelectedGoal(null);
  };

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
              {formatCurrency(5500)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Monthly Goal</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(500)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Active Goals</h3>
            <p className="text-3xl font-bold text-blue-600">3</p>
          </div>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card title="Savings Progress">
        <div className="h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
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

      {/* Savings Goals List */}
      <Card>
        {savingsGoals.length === 0 ? (
          <EmptyState
            title="No savings goals"
            description="Start by creating your first savings goal"
            icon={TrendingUp}
            action={
              <Button onClick={() => setShowAddForm(true)}>
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
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Target date: {formatDate(goal.targetDate)}
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
                    <span>Monthly: {formatCurrency(goal.monthlyContribution)}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedGoal(goal)}
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
          setSelectedGoal(null);
        }}
        title={selectedGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}
      >
        {/* Form content */}
      </Modal>
    </div>
  );
};

export default SavingsPage;

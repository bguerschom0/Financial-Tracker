// src/pages/savings/index.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SavingsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSavingGoal, setNewSavingGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: '',
    monthlyContribution: ''
  });

  // Sample data - replace with Supabase data
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
    {
      id: 2,
      name: 'New Car',
      targetAmount: 25000,
      currentAmount: 8000,
      targetDate: '2026-06-30',
      category: 'Vehicle',
      monthlyContribution: 1000,
      progress: 32
    },
    {
      id: 3,
      name: 'House Down Payment',
      targetAmount: 50000,
      currentAmount: 15000,
      targetDate: '2027-01-31',
      category: 'Housing',
      monthlyContribution: 1500,
      progress: 30
    }
  ];

  // Sample progress data
  const progressData = [
    { month: 'Jan', savings: 4200 },
    { month: 'Feb', savings: 4800 },
    { month: 'Mar', savings: 5500 },
    { month: 'Apr', savings: 6100 },
    { month: 'May', savings: 6800 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save to Supabase
    console.log('New saving goal:', newSavingGoal);
    setShowAddForm(false);
    setNewSavingGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: '',
      monthlyContribution: ''
    });
  };

  const calculateTotalSavings = () => {
    return savingsGoals.reduce((total, goal) => total + goal.currentAmount, 0);
  };

  const calculateMonthlyContributions = () => {
    return savingsGoals.reduce((total, goal) => total + goal.monthlyContribution, 0);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Savings Goals</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Savings</h3>
          <p className="text-3xl font-bold text-green-600">${calculateTotalSavings().toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Contributions</h3>
          <p className="text-3xl font-bold text-blue-600">${calculateMonthlyContributions().toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Goals</h3>
          <p className="text-3xl font-bold text-purple-600">{savingsGoals.length}</p>
        </div>
      </div>

      {/* Savings Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Savings Progress</h3>
        <div className="h-64">
          <LineChart width={800} height={240} data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="savings" stroke="#10B981" name="Total Savings" />
          </LineChart>
        </div>
      </div>

      {/* Add Saving Goal Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Saving Goal</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Goal Name</label>
                  <input
                    type="text"
                    value={newSavingGoal.name}
                    onChange={(e) => setNewSavingGoal({...newSavingGoal, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Amount</label>
                  <input
                    type="number"
                    value={newSavingGoal.targetAmount}
                    onChange={(e) => setNewSavingGoal({...newSavingGoal, targetAmount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Amount</label>
                  <input
                    type="number"
                    value={newSavingGoal.currentAmount}
                    onChange={(e) => setNewSavingGoal({...newSavingGoal, currentAmount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Date</label>
                  <input
                    type="date"
                    value={newSavingGoal.targetDate}
                    onChange={(e) => setNewSavingGoal({...newSavingGoal, targetDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newSavingGoal.category}
                    onChange={(e) => setNewSavingGoal({...newSavingGoal, category: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Emergency">Emergency Fund</option>
                    <option value="Housing">Housing</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Education">Education</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Contribution</label>
                  <input
                    type="number"
                    value={newSavingGoal.monthlyContribution}
                    onChange={(e) => setNewSavingGoal({...newSavingGoal, monthlyContribution: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Savings Goals List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {savingsGoals.map((goal) => (
                <tr key={goal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{goal.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goal.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${goal.targetAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${goal.currentAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{goal.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${goal.monthlyContribution}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goal.targetDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;

// src/pages/debts/index.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DebtsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: '',
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    type: ''
  });

  // Sample data - replace with Supabase data
  const debts = [
    {
      id: 1,
      name: 'Car Loan',
      totalAmount: 25000,
      remainingAmount: 18000,
      interestRate: 4.5,
      minimumPayment: 450,
      dueDate: '2025-02-15',
      type: 'Auto Loan'
    },
    {
      id: 2,
      name: 'Credit Card',
      totalAmount: 5000,
      remainingAmount: 3500,
      interestRate: 19.99,
      minimumPayment: 150,
      dueDate: '2025-02-20',
      type: 'Credit Card'
    },
    {
      id: 3,
      name: 'Student Loan',
      totalAmount: 30000,
      remainingAmount: 25000,
      interestRate: 5.5,
      minimumPayment: 300,
      dueDate: '2025-02-25',
      type: 'Student Loan'
    }
  ];

  const debtChartData = debts.map(debt => ({
    name: debt.name,
    remaining: debt.remainingAmount,
    paid: debt.totalAmount - debt.remainingAmount
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save to Supabase
    console.log('New debt:', newDebt);
    setShowAddForm(false);
    setNewDebt({
      name: '',
      totalAmount: '',
      remainingAmount: '',
      interestRate: '',
      minimumPayment: '',
      dueDate: '',
      type: ''
    });
  };

  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.remainingAmount, 0);
  };

  const calculateMonthlyPayments = () => {
    return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Debt Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Debt
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Debt</h3>
          <p className="text-3xl font-bold text-red-600">${calculateTotalDebt().toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Payments</h3>
          <p className="text-3xl font-bold text-orange-600">${calculateMonthlyPayments().toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Number of Debts</h3>
          <p className="text-3xl font-bold text-blue-600">{debts.length}</p>
        </div>
      </div>

      {/* Debt Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Debt Progress</h3>
        <div className="h-64">
          <BarChart width={800} height={240} data={debtChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="remaining" stackId="a" fill="#EF4444" name="Remaining" />
            <Bar dataKey="paid" stackId="a" fill="#10B981" name="Paid" />
          </BarChart>
        </div>
      </div>

      {/* Add Debt Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Debt</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Debt Name</label>
                  <input
                    type="text"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <input
                    type="number"
                    value={newDebt.totalAmount}
                    onChange={(e) => setNewDebt({...newDebt, totalAmount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
                  <input
                    type="number"
                    value={newDebt.remainingAmount}
                    onChange={(e) => setNewDebt({...newDebt, remainingAmount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDebt.interestRate}
                    onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Payment</label>
                  <input
                    type="number"
                    value={newDebt.minimumPayment}
                    onChange={(e) => setNewDebt({...newDebt, minimumPayment: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newDebt.type}
                    onChange={(e) => setNewDebt({...newDebt, type: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Auto Loan">Auto Loan</option>
                    <option value="Student Loan">Student Loan</option>
                    <option value="Mortgage">Mortgage</option>
                    <option value="Other">Other</option>
                  </select>
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

      {/* Debts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {debts.map((debt) => (
                <tr key={debt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{debt.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${debt.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">${debt.remainingAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.interestRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${debt.minimumPayment}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.dueDate}</td>
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

export default DebtsPage;

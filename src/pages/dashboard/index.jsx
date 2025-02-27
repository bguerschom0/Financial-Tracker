// src/pages/dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatting';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const [userCurrency, setUserCurrency] = useState('USD');
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError 
  } = useTransactions();
  
  const [monthlyData, setMonthlyData] = useState([]);

  // Get user's preferred currency
  useEffect(() => {
    if (user && user.currency) {
      setUserCurrency(user.currency);
    }
  }, [user]);

  useEffect(() => {
    if (transactions.length > 0) {
      // Process transactions for chart data
      const data = processTransactionsForChart(transactions);
      setMonthlyData(data);
    }
  }, [transactions]);

  if (transactionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (transactionsError) {
    return (
      <Alert type="error" className="mt-4">
        Error loading dashboard data: {transactionsError}. Please try again later.
      </Alert>
    );
  }

  const totalBalance = calculateTotalBalance(transactions);
  const monthlyIncome = calculateMonthlyIncome(transactions);
  const monthlyExpenses = calculateMonthlyExpenses(transactions);
  const savingsRate = calculateSavingsRate(monthlyIncome, monthlyExpenses);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's a summary of your financial status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Total Balance</h3>
            <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalBalance, userCurrency)}
            </p>
            <p className="text-sm text-gray-500">Current net position</p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Monthly Income</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(monthlyIncome, userCurrency)}
            </p>
            <p className="text-sm text-gray-500">Current month</p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Monthly Expenses</h3>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(monthlyExpenses, userCurrency)}
            </p>
            <p className="text-sm text-gray-500">Current month</p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-700">Savings Rate</h3>
            <p className="text-3xl font-bold text-blue-600">
              {savingsRate}%
            </p>
            <p className="text-sm text-gray-500">Income saved</p>
          </div>
        </Card>
      </div>

      {/* Monthly Overview Chart */}
      {monthlyData.length > 0 ? (
        <Card title="Monthly Overview">
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value, userCurrency)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#3B82F6" 
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-500">No transaction data available to display in chart.</p>
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {transactions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No transactions recorded yet. Add income or expenses to see them here.</p>
          </div>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium
                      ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(
                        parseFloat(transaction.amount) || 0, 
                        transaction.currency || userCurrency
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;

// Helper functions
const processTransactionsForChart = (transactions) => {
  // Group transactions by month and calculate totals
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0, savings: 0 };
    }
    
    // Ensure amount is a number
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
    
    if (transaction.type === 'income') {
      acc[month].income += amount;
    } else {
      acc[month].expenses += amount;
    }
    
    acc[month].savings = acc[month].income - acc[month].expenses;
    
    return acc;
  }, {});

  // Convert to array and sort by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Object.values(monthlyData).sort((a, b) => {
    return months.indexOf(a.month) - months.indexOf(b.month);
  });
};

const calculateTotalBalance = (transactions) => {
  return transactions.reduce((total, transaction) => {
    // Ensure amount is a number
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
      
    return total + (transaction.type === 'income' ? amount : -amount);
  }, 0);
};

const calculateMonthlyIncome = (transactions) => {
  const currentMonth = new Date().getMonth();
  return transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => {
      // Ensure amount is a number
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return sum + amount;
    }, 0);
};

const calculateMonthlyExpenses = (transactions) => {
  const currentMonth = new Date().getMonth();
  return transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => {
      // Ensure amount is a number
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      return sum + amount;
    }, 0);
};

const calculateSavingsRate = (income, expenses) => {
  if (income <= 0) return 0;
  const savings = income - expenses;
  return Math.round((savings / income) * 100);
};

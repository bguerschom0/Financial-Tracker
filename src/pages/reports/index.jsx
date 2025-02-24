// src/pages/reports/index.jsx
import React, { useState } from 'react';
import  Card  from '../../components/ui/Card';
import  Select  from '../../components/ui/Select';
import  Button  from '../../components/ui/Button';
import  DatePicker  from '../../components/ui/DatePicker';
import  LoadingSpinner  from '../../components/ui/LoadingSpinner';
import { Download, PieChart, BarChart as BarChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartPie, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatting';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual API calls
  const incomeData = [
    { name: 'Salary', value: 5000 },
    { name: 'Freelance', value: 1200 },
    { name: 'Investments', value: 800 },
  ];

  const expenseData = [
    { name: 'Housing', value: 1500 },
    { name: 'Food', value: 600 },
    { name: 'Transportation', value: 400 },
    { name: 'Utilities', value: 300 },
    { name: 'Entertainment', value: 200 },
  ];

  const trendData = [
    { month: 'Jan', income: 4500, expenses: 3200, savings: 1300 },
    { month: 'Feb', income: 4800, expenses: 3100, savings: 1700 },
    { month: 'Mar', income: 4600, expenses: 3300, savings: 1300 },
  ];

  const handleExportReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze your financial data and generate reports
          </p>
        </div>
        <Button
          onClick={handleExportReport}
          disabled={loading}
          className="sm:self-start"
        >
          {loading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Download className="h-5 w-5 mr-2" />
          )}
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'overview', label: 'Overview' },
              { value: 'income', label: 'Income Analysis' },
              { value: 'expenses', label: 'Expense Analysis' },
              { value: 'trends', label: 'Trends' },
            ]}
          />
          <Select
            label="Time Period"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
              { value: 'custom', label: 'Custom Range' },
            ]}
          />
        </div>
      </Card>

      {/* Reports Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Distribution */}
        <Card title="Income Distribution">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#10B981"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Categories */}
        <Card title="Expense Categories">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card title="Monthly Trends" className="lg:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
                <Line type="monotone" dataKey="savings" stroke="#3B82F6" name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card title="Summary Statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Total Income</h4>
            <p className="mt-1 text-2xl font-semibold text-green-600">
              {formatCurrency(7000)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Total Expenses</h4>
            <p className="mt-1 text-2xl font-semibold text-red-600">
              {formatCurrency(3000)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Net Savings</h4>
            <p className="mt-1 text-2xl font-semibold text-blue-600">
              {formatCurrency(4000)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500">Savings Rate</h4>
            <p className="mt-1 text-2xl font-semibold text-purple-600">
              57%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;

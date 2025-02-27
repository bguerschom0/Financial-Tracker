// src/pages/reports/index.jsx
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { Download, PieChart, BarChart as BarChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatting';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const ReportsPage = () => {
  const { user } = useAuth();
  const [userCurrency, setUserCurrency] = useState('USD');
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState(getDateRangeStart('month'));
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0
  });

  // Get all transactions, we'll filter them based on date range
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError 
  } = useTransactions();

  // Get user's preferred currency
  useEffect(() => {
    if (user && user.currency) {
      setUserCurrency(user.currency);
    }
  }, [user]);

  // Update date range when selection changes
  useEffect(() => {
    setStartDate(getDateRangeStart(dateRange));
    // End date is always today
    setEndDate(new Date().toISOString().split('T')[0]);
  }, [dateRange]);

  // Process transaction data when date range or transactions change
  useEffect(() => {
    if (transactionsLoading) return;
    if (transactionsError) {
      setError(transactionsError);
      return;
    }

    setLoading(true);
    
    try {
      // Filter transactions by date range
      const filteredTransactions = filterTransactionsByDateRange(
        transactions, startDate, endDate
      );
      
      // Process data for charts
      processReportData(filteredTransactions);
      
    } catch (err) {
      console.error('Error processing report data:', err);
      setError('Failed to process report data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [transactions, startDate, endDate, transactionsLoading, transactionsError]);

  // Generate date range start based on selection
  function getDateRangeStart(range) {
    const now = new Date();
    let start = new Date();
    
    switch (range) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setMonth(now.getMonth() - 1); // Default to month
    }
    
    return start.toISOString().split('T')[0];
  }

  // Filter transactions by date range
  function filterTransactionsByDateRange(transactions, startDate, endDate) {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }

  // Process transaction data for reports
  function processReportData(filteredTransactions) {
    // Income distribution data
    const incomeByCategory = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});
    
    const incomeChartData = Object.keys(incomeByCategory).map(category => ({
      name: category,
      value: incomeByCategory[category]
    })).sort((a, b) => b.value - a.value);
    
    // Expense distribution data
    const expenseByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});
    
    const expenseChartData = Object.keys(expenseByCategory).map(category => ({
      name: category,
      value: expenseByCategory[category]
    })).sort((a, b) => b.value - a.value);
    
    // Monthly trend data
    const monthlyData = filteredTransactions.reduce((acc, t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0, savings: 0 };
      }
      
      const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      
      if (t.type === 'income') {
        acc[month].income += amount;
      } else {
        acc[month].expenses += amount;
      }
      
      acc[month].savings = acc[month].income - acc[month].expenses;
      
      return acc;
    }, {});
    
    // Sort months chronologically
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendChartData = Object.values(monthlyData).sort((a, b) => {
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
    
    // Calculate summary statistics
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => {
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        return sum + amount;
      }, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        return sum + amount;
      }, 0);
    
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
    
    // Update state with processed data
    setIncomeData(incomeChartData);
    setExpenseData(expenseChartData);
    setTrendData(trendChartData);
    setSummaryStats({
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate
    });
  }

  // Export report data to CSV
  const handleExportReport = async () => {
    try {
      setExporting(true);
      
      // Filter transactions by date range
      const reportTransactions = filterTransactionsByDateRange(
        transactions, startDate, endDate
      );
      
      if (reportTransactions.length === 0) {
        addNotification('No data to export for the selected date range', 'warning');
        return;
      }
      
      // Format transactions for CSV export
      const csvData = reportTransactions.map(t => ({
        Date: new Date(t.date).toLocaleDateString(),
        Description: t.description,
        Category: t.category || 'Uncategorized',
        Amount: t.amount,
        Currency: t.currency || userCurrency,
        Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        Notes: t.notes || ''
      }));
      
      // Convert to CSV string
      const replacer = (key, value) => value === null ? '' : value;
      const header = Object.keys(csvData[0]);
      let csv = csvData.map(row => header.map(fieldName => 
        JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      csv = csv.join('\r\n');
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addNotification('Report exported successfully', 'success');
    } catch (err) {
      console.error('Error exporting report:', err);
      addNotification('Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  // Add a notification - simulated for now
  const addNotification = (message, type) => {
    // This would be replaced with your actual notification system
    console.log(`${type}: ${message}`);
    alert(message);
  };

  // Custom colors for charts
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
  
  // Display loading state
  if (transactionsLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Display error state
  if (error || transactionsError) {
    return (
      <Alert type="error" className="mt-4">
        {error || transactionsError}. Please try again later.
      </Alert>
    );
  }

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
          disabled={exporting || transactions.length === 0}
          className="sm:self-start"
        >
          {exporting ? (
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
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'quarter', label: 'Last 3 Months' },
              { value: 'year', label: 'Last 12 Months' },
            ]}
          />
        </div>
      </Card>

      {transactions.length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-500">No transaction data available. Add some transactions to generate reports.</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Reports Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Distribution */}
            <Card title="Income Distribution">
              {incomeData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No income data for the selected period</p>
                </div>
              ) : (
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {incomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value, userCurrency)} 
                        separator=": "
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Expense Categories */}
            <Card title="Expense Categories">
              {expenseData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No expense data for the selected period</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value, userCurrency)} />
                      <Legend />
                      <Bar dataKey="value" fill="#EF4444">
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Monthly Trends */}
            <Card title="Monthly Trends" className="lg:col-span-2">
              {trendData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No trend data for the selected period</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value, userCurrency)} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
                      <Line type="monotone" dataKey="savings" stroke="#3B82F6" name="Savings" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>

          {/* Summary Statistics */}
          <Card title="Summary Statistics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Total Income</h4>
                <p className="mt-1 text-2xl font-semibold text-green-600">
                  {formatCurrency(summaryStats.totalIncome, userCurrency)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Total Expenses</h4>
                <p className="mt-1 text-2xl font-semibold text-red-600">
                  {formatCurrency(summaryStats.totalExpenses, userCurrency)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Net Savings</h4>
                <p className="mt-1 text-2xl font-semibold text-blue-600">
                  {formatCurrency(summaryStats.netSavings, userCurrency)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Savings Rate</h4>
                <p className="mt-1 text-2xl font-semibold text-purple-600">
                  {summaryStats.savingsRate}%
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsPage;

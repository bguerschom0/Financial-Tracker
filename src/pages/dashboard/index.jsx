// src/pages/dashboard/index.jsx


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DashboardPage = () => {
  // Sample data - replace with actual data from Supabase
  const monthlyData = [
    { month: 'Jan', income: 4500, expenses: 3200, savings: 1300 },
    { month: 'Feb', income: 4800, expenses: 3100, savings: 1700 },
    { month: 'Mar', income: 4600, expenses: 3300, savings: 1300 },
  ];

  const recentTransactions = [
    { id: 1, type: 'expense', category: 'Groceries', amount: 150.50, date: '2025-02-12' },
    { id: 2, type: 'income', category: 'Salary', amount: 4500.00, date: '2025-02-10' },
    { id: 3, type: 'expense', category: 'Utilities', amount: 200.00, date: '2025-02-09' },
  ];

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Balance</h3>
          <p className="text-3xl font-bold text-blue-600">$12,500</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Income</h3>
          <p className="text-3xl font-bold text-green-600">$4,500</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-red-600">$3,200</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Overview</h3>
        <div className="h-64">
          <LineChart width={800} height={240} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10B981" />
            <Line type="monotone" dataKey="expenses" stroke="#EF4444" />
            <Line type="monotone" dataKey="savings" stroke="#3B82F6" />
          </LineChart>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      ${transaction.amount.toFixed(2)}
                    </span>
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

export default DashboardPage;

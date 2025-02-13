// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import NotFound from './pages/NotFound';

// Import your pages
import DashboardPage from './pages/dashboard';
import IncomePage from './pages/income';
import ExpensesPage from './pages/expenses';
import DebtsPage from './pages/debts';
import SavingsPage from './pages/savings';
import SettingsPage from './pages/settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="debts" element={<DebtsPage />} />
          <Route path="savings" element={<SavingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Handle 404s */}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

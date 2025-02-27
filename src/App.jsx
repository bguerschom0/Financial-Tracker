// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NotificationProvider } from './hooks/useNotification';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages for better performance
const DashboardPage = React.lazy(() => import('./pages/dashboard'));
const IncomePage = React.lazy(() => import('./pages/income'));
const ExpensesPage = React.lazy(() => import('./pages/expenses'));
const DebtsPage = React.lazy(() => import('./pages/debts'));
const SavingsPage = React.lazy(() => import('./pages/savings'));
const ReportsPage = React.lazy(() => import('./pages/reports'));
const ProfilePage = React.lazy(() => import('./pages/profile'));
const SettingsPage = React.lazy(() => import('./pages/settings'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/app" element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="income" element={<IncomePage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="debts" element={<DebtsPage />} />
                <Route path="savings" element={<SavingsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Handle 404s */}
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;

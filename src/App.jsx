// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';

// Import pages
import DashboardPage from './pages/dashboard';
import IncomePage from './pages/income';
import ExpensesPage from './pages/expenses';
import DebtsPage from './pages/debts';
import SavingsPage from './pages/savings';
import SettingsPage from './pages/settings';
import NotFound from './pages/NotFound';

// Import contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [environmentChecked, setEnvironmentChecked] = useState(false);

  useEffect(() => {
    const checkEnvironment = () => {
      console.log('Checking environment variables and configuration...');
      
      // Check required environment variables
      const requiredEnvVars = [
        'REACT_APP_SUPABASE_URL',
        'REACT_APP_SUPABASE_ANON_KEY'
      ];

      const missingEnvVars = requiredEnvVars.filter(
        varName => !process.env[varName]
      );

      if (missingEnvVars.length > 0) {
        console.error('Missing required environment variables:', missingEnvVars);
        setError(`Missing environment variables: ${missingEnvVars.join(', ')}`);
        return false;
      }

      return true;
    };

    const checkSupabaseConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('profiles').select('count');
        
        if (error) {
          console.error('Supabase connection error:', error);
          setError(`Database connection error: ${error.message}`);
          return false;
        }

        console.log('Supabase connection successful');
        return true;
      } catch (err) {
        console.error('Supabase connection test failed:', err);
        setError(`Database connection test failed: ${err.message}`);
        return false;
      }
    };

    const initializeApp = async () => {
      try {
        const envCheck = checkEnvironment();
        if (!envCheck) return;

        const dbCheck = await checkSupabaseConnection();
        if (!dbCheck) return;

        setEnvironmentChecked(true);
      } catch (err) {
        console.error('App initialization error:', err);
        setError(`Initialization error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Log general debugging information
    console.log('App version:', process.env.REACT_APP_VERSION);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Build date:', process.env.REACT_APP_BUILD_DATE);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Initialization Error</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h2 className="text-lg font-semibold mb-2">Troubleshooting Steps:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Check if all environment variables are properly set</li>
              <li>Verify Supabase URL and API key</li>
              <li>Check your network connection</li>
              <li>Review browser console for detailed error logs</li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
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
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;

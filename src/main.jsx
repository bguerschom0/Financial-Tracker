// src/main.jsx

import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from './App';
import './styles/globals.css';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Error tracking function
function logError(error, errorInfo) {
  console.error('Application Error:', error);
  console.error('Error Info:', errorInfo);
  // You can add more error tracking services here
}

// Performance monitoring
const reportWebVitals = (metric) => {
  console.log(metric);
  // You can add performance monitoring services here
};

window.addEventListener('error', (event) => {
  logError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason);
});

// Root render function
function render() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
        <App />
      </SessionContextProvider>
    </React.StrictMode>
  );
}

// Initialize the application
try {
  console.log('Initializing application...');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Base URL:', import.meta.env.BASE_URL);
  
  // Check for browser compatibility
  if (!window.fetch) {
    throw new Error('Browser not supported: fetch is not available');
  }

  // Start the application
  render();
  
  // Report initial web vitals
  reportWebVitals();

} catch (error) {
  console.error('Failed to initialize application:', error);
  
  // Show user-friendly error message
  document.getElementById('root').innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      font-family: Arial, sans-serif;
    ">
      <h1 style="color: #E11D48;">Application Error</h1>
      <p style="color: #4B5563;">Sorry, something went wrong while loading the application.</p>
      <button 
        onclick="window.location.reload()" 
        style="
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #2563EB;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        "
      >
        Reload Page
      </button>
    </div>
  `;
}

// Hot Module Replacement (HMR) for development
if (import.meta.hot) {
  import.meta.hot.accept();
}

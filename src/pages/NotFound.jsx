// src/pages/NotFound.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    // If not, redirect to landing page
    // We add a small delay for better UX - showing the 404 page briefly
    const timer = setTimeout(() => {
      if (user) {
        navigate('/app');
      } else {
        navigate('/');
      }
    }, 3000); // 3-second delay before redirect

    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {user ? 'Redirecting to dashboard...' : 'Redirecting to home page...'}
        </p>
        <div className="mt-6">
          <Link
            to={user ? '/app' : '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {user ? 'Go to Dashboard' : 'Go to Home Page'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

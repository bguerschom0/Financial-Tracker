// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, PieChart, Wallet, Shield, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Financial Tracker</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
          
          {/* Mobile menu, show/hide based on state */}
          {menuOpen && (
            <div className="md:hidden py-3 space-y-2">
              <Link
                to="/login"
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center bg-primary-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block mb-1 md:mb-2">Take Control of Your</span>
            <span className="block text-primary-600">Financial Future</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Track your income, expenses, and savings all in one place. Make smarter financial decisions with our comprehensive tracking tools.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 md:mb-12 md:text-3xl">Key Features</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-200 rounded-lg transition-shadow hover:shadow-md">
              <div className="bg-primary-100 inline-flex p-3 rounded-md">
                <PieChart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Expense Tracking</h3>
              <p className="mt-2 text-base text-gray-500">
                Monitor your spending patterns and categorize expenses automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-gray-200 rounded-lg transition-shadow hover:shadow-md">
              <div className="bg-primary-100 inline-flex p-3 rounded-md">
                <Wallet className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Budget Management</h3>
              <p className="mt-2 text-base text-gray-500">
                Set and track budgets for different categories and receive alerts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-gray-200 rounded-lg transition-shadow hover:shadow-md">
              <div className="bg-primary-100 inline-flex p-3 rounded-md">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Data</h3>
              <p className="mt-2 text-base text-gray-500">
                Your financial data is encrypted and securely stored.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary-800 md:text-3xl">
            Ready to take control of your finances?
          </h2>
          <p className="mt-3 text-gray-600 max-w-md mx-auto md:mt-4">
            Join thousands of users who are already managing their money better.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <DollarSign className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">Financial Tracker</span>
            </div>
            
            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Financial Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

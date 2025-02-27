// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, DollarSign, CreditCard, 
  Wallet, PiggyBank, Settings, X,
  BarChart, FileText, User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Home },
  { name: 'Income', href: '/app/income', icon: DollarSign },
  { name: 'Expenses', href: '/app/expenses', icon: CreditCard },
  { name: 'Debts', href: '/app/debts', icon: Wallet },
  { name: 'Savings', href: '/app/savings', icon: PiggyBank },
  { name: 'Reports', href: '/app/reports', icon: BarChart },
  { name: 'Profile', href: '/app/profile', icon: User },
  { name: 'Settings', href: '/app/settings', icon: Settings }
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform 
          duration-300 ease-in-out lg:transform-none lg:relative
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="lg:hidden absolute right-2 top-2">
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0 px-6 py-4 flex items-center">
            <DollarSign className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Financial Tracker
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    transition-colors duration-150 ease-in-out
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => onClose()}
                >
                  <item.icon 
                    className={`h-5 w-5 mr-3 ${
                      isActive ? 'text-primary-600' : 'text-gray-400'
                    }`} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* App Version */}
          <div className="px-6 py-4 text-xs text-gray-400">
            Version 1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

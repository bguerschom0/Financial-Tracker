// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Settings, LogOut, CreditCard, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const Header = ({ toggleSidebar }) => {
  const { user, signOut } = useAuth();
  const { notifications, addNotification } = useNotification();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      addNotification('You have been signed out successfully', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      addNotification('Failed to sign out. Please try again.', 'error');
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          {/* Right */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-600 focus:outline-none">
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-600"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">
                      {user?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.currency || 'USD'}
                    </div>
                  </div>
                </div>
              </button>
              
              {/* Dropdown menu */}
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link 
                      to="/app/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    
                    <Link 
                      to="/app/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

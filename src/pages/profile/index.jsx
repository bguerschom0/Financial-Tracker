// src/pages/profile/index.jsx
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { api } from '../../lib/api';
import CurrencySelector from '../../components/ui/CurrencySelector';
import UpdatePassword from '../../components/account/UpdatePassword';
import { User, Mail, Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/formatting';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: '',
    currency: 'USD',
    language: 'en',
    timezone: 'UTC'
  });

  // Load user profile
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Load user profile
        const profile = await api.getProfile();
        
        setUserProfile({
          full_name: profile.full_name || '',
          email: profile.email || '',
          currency: profile.currency || 'USD',
          language: profile.language || 'en',
          timezone: profile.timezone || 'UTC'
        });
        
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Update profile in database
      const updatedProfile = await api.updateProfile({
        full_name: userProfile.full_name,
        email: userProfile.email,
        currency: userProfile.currency,
        language: userProfile.language,
        timezone: userProfile.timezone
      });
      
      // Update user in context
      if (updateUser) {
        updateUser(updatedProfile);
      }
      
      addNotification('Profile updated successfully', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      addNotification('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    setUserProfile(prev => ({
      ...prev,
      currency
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and preferences
        </p>
      </div>

      {/* User Profile Overview */}
      <Card>
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-16 w-16 text-primary-600" />
            </div>
          </div>
          
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-900">{userProfile.full_name}</h2>
            <p className="text-sm text-gray-500">{userProfile.email || 'No email set'}</p>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>Member since: {user ? formatDate(user.created_at) : 'Unknown'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>Last login: {user && user.last_login ? formatDate(user.last_login) : 'Never'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Settings */}
      <Card title="Profile Settings">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={userProfile.full_name}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={saving}
              />
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userProfile.email}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={saving}
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <CurrencySelector
                value={userProfile.currency}
                onChange={handleCurrencyChange}
                disabled={saving}
              />
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={userProfile.language}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={saving}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="md:col-span-2">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={userProfile.timezone}
                onChange={handleChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={saving}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Denver">Mountain Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Africa/Kigali">Kigali</option>
                <option value="Africa/Nairobi">Nairobi</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit"
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Update */}
      <UpdatePassword />

      {/* Account Deletion */}
      <Card className="bg-red-50">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-700">Delete Account</h3>
          <p className="text-sm text-red-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion would be implemented here');
              }
            }}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

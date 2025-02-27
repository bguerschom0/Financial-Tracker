// src/pages/profile/index.jsx
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { api } from '../../lib/api';
import { supabase, TABLES } from '../../lib/supabase';
import CurrencySelector from '../../components/ui/CurrencySelector';
import { User, Calendar, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatting';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const ProfilePage = () => {
  const { user, updateUser, signOut } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Profile state
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    currency: 'USD',
    language: 'en',
    timezone: 'UTC'
  });

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password strength indicators
  const passwordHasMinLength = passwordData.newPassword.length >= 8;
  const passwordHasUppercase = /[A-Z]/.test(passwordData.newPassword);
  const passwordHasLowercase = /[a-z]/.test(passwordData.newPassword);
  const passwordHasNumber = /\d/.test(passwordData.newPassword);
  const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

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

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification('New passwords do not match', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      addNotification('Password must be at least 8 characters', 'error');
      return;
    }
    
    try {
      setSaving(true);
      
      // Verify current password
      // Note: In production, this should be handled on the server
      const { data: userData, error: fetchError } = await supabase
        .from(TABLES.USERS)
        .select('password_hash')
        .eq('id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // In a real app with proper hashing:
      // const isValid = await bcrypt.compare(passwordData.currentPassword, userData.password_hash);
      const isValid = userData.password_hash === passwordData.currentPassword;
      
      if (!isValid) {
        addNotification('Current password is incorrect', 'error');
        setSaving(false);
        return;
      }
      
      // Update password
      // In a real app: const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);
      const { error: updateError } = await supabase
        .from(TABLES.USERS)
        .update({
          password_hash: passwordData.newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setShowPasswordForm(false);
      addNotification('Password updated successfully', 'success');
      
    } catch (err) {
      console.error('Error updating password:', err);
      addNotification(`Failed to update password: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      return;
    }
    
    try {
      setSaving(true);
      
      // First delete all user data
      // Transactions
      await supabase
        .from(TABLES.TRANSACTIONS)
        .delete()
        .eq('user_id', user.id);
      
      // Debts
      await supabase
        .from(TABLES.DEBTS)
        .delete()
        .eq('user_id', user.id);
      
      // Savings
      await supabase
        .from(TABLES.SAVINGS)
        .delete()
        .eq('user_id', user.id);
      
      // Settings
      await supabase
        .from(TABLES.SETTINGS)
        .delete()
        .eq('user_id', user.id);
      
      // Sessions
      await supabase
        .from(TABLES.SESSIONS)
        .delete()
        .eq('user_id', user.id);
      
      // Finally delete the user account
      const { error: deleteError } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('id', user.id);
        
      if (deleteError) throw deleteError;
      
      // Sign out the user
      await signOut();
      
      // Redirect to landing page
      navigate('/');
      
      // Show notification
      addNotification('Your account has been successfully deleted', 'info');
      
    } catch (err) {
      console.error('Error deleting account:', err);
      addNotification(`Failed to delete account: ${err.message}`, 'error');
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
  
  // Handle password input changes
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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
            <div>
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
              isLoading={saving && !showPasswordForm}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Change */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Password</h3>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </Button>
        </div>
        
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4 mt-4 pt-4 border-t border-gray-200">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md mt-1"
                disabled={saving}
                required
              />
            </div>
            
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md mt-1"
                disabled={saving}
                required
              />
              
              {/* Password strength indicators */}
              {passwordData.newPassword && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">Password strength:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center ${passwordHasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasMinLength ? '✓' : '•'} At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordHasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasUppercase ? '✓' : '•'} Contains uppercase letter
                    </li>
                    <li className={`flex items-center ${passwordHasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasLowercase ? '✓' : '•'} Contains lowercase letter
                    </li>
                    <li className={`flex items-center ${passwordHasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasNumber ? '✓' : '•'} Contains a number
                    </li>
                    <li className={`flex items-center ${passwordHasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasSpecialChar ? '✓' : '•'} Contains a special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md mt-1"
                disabled={saving}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                isLoading={saving && showPasswordForm}
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Account Deletion */}
      <Card className="bg-red-50">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-700">Delete Account</h3>
          <p className="text-sm text-red-600">
            Once you delete your account, all your data will be permanently removed. This action cannot be undone.
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={saving}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

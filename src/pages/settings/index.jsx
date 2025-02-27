// src/pages/settings/index.jsx
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { api } from '../../lib/api';
import CurrencySelector, { SUPPORTED_CURRENCIES } from '../../components/ui/CurrencySelector';

const SettingsPage = () => {
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

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetAlerts: true,
    billReminders: true,
    savingsUpdates: true,
    monthlyReports: true
  });

  // Load user profile and settings
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
        
        // Load notification settings
        try {
          const settings = await api.getSettings();
          
          if (settings) {
            setNotifications({
              emailAlerts: settings.email_alerts || false,
              budgetAlerts: settings.budget_alerts || false,
              billReminders: settings.bill_reminders || false,
              savingsUpdates: settings.savings_updates || false,
              monthlyReports: settings.monthly_reports || false
            });
          }
        } catch (settingsError) {
          console.error('Error loading settings:', settingsError);
          // Continue even if settings fail to load
        }
        
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
      
      // Update user in context if needed
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

  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    try {
      setSaving(true);
      
      // Map to API format
      const notificationSettings = {
        email_alerts: notifications.emailAlerts,
        budget_alerts: notifications.budgetAlerts,
        bill_reminders: notifications.billReminders,
        savings_updates: notifications.savingsUpdates,
        monthly_reports: notifications.monthlyReports
      };
      
      // Update settings in database
      await api.updateSettings(notificationSettings);
      
      addNotification('Notification preferences updated', 'success');
    } catch (err) {
      console.error('Error updating notification settings:', err);
      addNotification('Failed to update notification preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle data export
  const handleExportData = async () => {
    try {
      // This would typically trigger an API call to export data
      // For now, we'll just show a notification
      addNotification('Data export started. You will receive an email when it\'s ready.', 'info');
    } catch (err) {
      console.error('Error exporting data:', err);
      addNotification('Failed to export data', 'error');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // This would typically call an API to delete the account
        // For now, we'll just show a notification
        addNotification('This feature is not yet implemented.', 'info');
      } catch (err) {
        console.error('Error deleting account:', err);
        addNotification('Failed to delete account', 'error');
      }
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card title="Profile Settings">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={userProfile.full_name}
              onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
              disabled={saving}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <CurrencySelector
                value={userProfile.currency}
                onChange={(val) => setUserProfile({ ...userProfile, currency: val })}
                disabled={saving}
              />
            </div>

            <Select
              label="Language"
              value={userProfile.language}
              onChange={(e) => setUserProfile({ ...userProfile, language: e.target.value })}
              options={[
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'French' },
                { value: 'es', label: 'Spanish' },
                { value: 'de', label: 'German' },
                { value: 'zh', label: 'Chinese' },
                { value: 'rw', label: 'Kinyarwanda' }
              ]}
              disabled={saving}
            />

            <Select
              label="Time Zone"
              value={userProfile.timezone}
              onChange={(e) => setUserProfile({ ...userProfile, timezone: e.target.value })}
              options={[
                { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
                { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
                { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
                { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
                { value: 'Europe/London', label: 'London' },
                { value: 'Europe/Paris', label: 'Paris' },
                { value: 'Africa/Kigali', label: 'Kigali' },
                { value: 'Africa/Nairobi', label: 'Nairobi' },
                { value: 'Asia/Tokyo', label: 'Tokyo' },
                { value: 'Australia/Sydney', label: 'Sydney' }
              ]}
              disabled={saving}
            />
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

      {/* Notification Preferences */}
      <Card title="Notification Preferences">
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked
                    });
                  }}
                  className="sr-only peer"
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                             peer-focus:ring-blue-300 rounded-full peer 
                             peer-checked:after:translate-x-full peer-checked:after:border-white 
                             after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                             after:bg-white after:border-gray-300 after:border after:rounded-full 
                             after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleNotificationUpdate}
              isLoading={saving}
            >
              Save Notification Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card title="Security Settings">
        <div className="space-y-4">
          <div>
            <Button variant="secondary">
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card title="Data Management">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
            <p className="text-sm text-gray-500">Download a copy of your financial data</p>
            <Button
              variant="secondary"
              onClick={handleExportData}
              className="mt-2"
            >
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-50">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
          <p className="text-sm text-red-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;

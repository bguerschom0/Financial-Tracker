// src/pages/settings/index.jsx
import React, { useState } from 'react';
import  Card  from '../../components/ui/Card';
import  Button  from '../../components/ui/Button';
import  Input  from '../../components/ui/Input';
import  Select  from '../../components/ui/Select';
import  Alert  from '../../components/ui/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const SettingsPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currency: 'USD',
    language: 'English',
    timeZone: 'UTC-5'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetAlerts: true,
    billReminders: true,
    savingsGoalUpdates: true,
    monthlyReports: true
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-15',
    sessionTimeout: '30'
  });

  const [dataPreferences, setDataPreferences] = useState({
    autoSync: true,
    dataRetention: '12',
    exportFormat: 'CSV'
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // API call to update profile
      addNotification('Profile updated successfully', 'success');
    } catch (error) {
      addNotification('Failed to update profile', 'error');
    }
  };

  const handleExportData = async () => {
    try {
      // API call to export data
      addNotification('Data export started', 'info');
    } catch (error) {
      addNotification('Failed to export data', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // API call to delete account
        addNotification('Account deleted successfully', 'success');
      } catch (error) {
        addNotification('Failed to delete account', 'error');
      }
    }
  };

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
              label="Name"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
            />
            
            <Input
              label="Email"
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
            />

            <Select
              label="Currency"
              value={userProfile.currency}
              onChange={(e) => setUserProfile({ ...userProfile, currency: e.target.value })}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' }
              ]}
            />

            <Select
              label="Language"
              value={userProfile.language}
              onChange={(e) => setUserProfile({ ...userProfile, language: e.target.value })}
              options={[
                { value: 'English', label: 'English' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'French', label: 'French' }
              ]}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
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
                {key.split(/(?=[A-Z])/).join(' ')}
              </label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({
                    ...notifications,
                    [key]: e.target.checked
                  })}
                  className="sr-only peer"
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
        </div>
      </Card>

      {/* Security Settings */}
      <Card title="Security Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <Button
              variant={security.twoFactorEnabled ? 'danger' : 'primary'}
              onClick={() => setSecurity({
                ...security,
                twoFactorEnabled: !security.twoFactorEnabled
              })}
            >
              {security.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>

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

          <div>
            <Select
              label="Data Retention Period"
              value={dataPreferences.dataRetention}
              onChange={(e) => setDataPreferences({
                ...dataPreferences,
                dataRetention: e.target.value
              })}
              options={[
                { value: '3', label: '3 months' },
                { value: '6', label: '6 months' },
                { value: '12', label: '12 months' }
              ]}
            />
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

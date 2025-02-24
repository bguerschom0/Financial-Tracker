// src/pages/profile/index.jsx
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../hooks/useAuth';
import { Camera, Key, Shield, Bell } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: null,
    joinDate: '2024-01-01',
    lastLogin: '2024-02-24 10:30 AM'
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save profile changes
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Overview */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Camera size={40} />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
              <Camera size={20} className="text-gray-600" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
            <p className="text-gray-500">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="primary">Premium Member</Badge>
              <Badge variant="success">Email Verified</Badge>
              <Badge variant="default">2FA Enabled</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card title="Personal Information">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="Phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
            />
            {isEditing && (
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            )}
          </form>
        </Card>

        {/* Account Activity */}
        <Card title="Account Activity">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Member Since</h4>
                <p className="text-sm text-gray-500">{profile.joinDate}</p>
              </div>
              <Shield className="text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Last Login</h4>
                <p className="text-sm text-gray-500">{profile.lastLogin}</p>
              </div>
              <Key className="text-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                <p className="text-sm text-gray-500">Email & Push enabled</p>
              </div>
              <Bell className="text-purple-500" />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card title="Security Settings">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
              <Button variant="secondary" className="mt-2">
                Manage 2FA
              </Button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-500 mt-1">Last changed 30 days ago</p>
              <Button variant="secondary" className="mt-2">
                Change Password
              </Button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Login Sessions</h4>
              <p className="text-sm text-gray-500 mt-1">Manage your active sessions</p>
              <Button variant="secondary" className="mt-2">
                View Sessions
              </Button>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card title="Preferences">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Budget alerts
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Bill reminders
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Monthly reports
                  </span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Language & Region</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue="USD"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card title="Connected Accounts">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
                <img 
                  src="/google-icon.png" 
                  alt="Google" 
                  className="w-6 h-6"
                />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Google</h4>
                <p className="text-sm text-gray-500">
                  Connected for single sign-on
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Disconnect
            </Button>
          </div>
          <div className="flex items-center justify-between py-4 border-t">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
                <img 
                  src="/bank-icon.png" 
                  alt="Bank" 
                  className="w-6 h-6"
                />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Bank Account</h4>
                <p className="text-sm text-gray-500">
                  Connected for transactions
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card title="Data & Privacy">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Data Export</h4>
            <p className="text-sm text-gray-500 mt-1">
              Download a copy of your data
            </p>
            <Button variant="secondary" className="mt-2">
              Export Data
            </Button>
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900">Privacy Settings</h4>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-600">
                  Share usage data to improve service
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-600">
                  Receive personalized recommendations
                </span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { User, Lock, Edit, Trash2, UserPlus, Shield, Search } from 'lucide-react';
import { supabase, TABLES } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { formatDate } from '../../utils/formatting';

const UserManagement = () => {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // Auth and notifications
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotification();
  
  // Form data
  const [newUserData, setNewUserData] = useState({
    full_name: '',
    username: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  });
  
  const [resetPasswordData, setResetPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only admins should fetch all users
      // For this example, we'll assume the current user is an admin
      const { data, error: fetchError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle new user form submission
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (newUserData.password !== newUserData.confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real implementation, you would use your auth.signUp function here
      // This is a simplified version
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([{
          full_name: newUserData.full_name,
          username: newUserData.username,
          password_hash: newUserData.password, // In production, this should be hashed
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
        
      if (error) throw error;
      
      addNotification('User added successfully', 'success');
      setShowAddModal(false);
      setNewUserData({
        full_name: '',
        username: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
      });
      
      // Refresh the users list
      fetchUsers();
      
    } catch (err) {
      console.error('Error adding user:', err);
      addNotification(`Failed to add user: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle user edit form submission
  const handleEditUser = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          full_name: selectedUser.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id)
        .select();
        
      if (error) throw error;
      
      addNotification('User updated successfully', 'success');
      setShowEditModal(false);
      setSelectedUser(null);
      
      // Refresh the users list
      fetchUsers();
      
    } catch (err) {
      console.error('Error updating user:', err);
      addNotification(`Failed to update user: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle password reset form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    // Validate form
    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real implementation, you would hash the password
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          password_hash: resetPasswordData.password, // In production, this should be hashed
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id)
        .select();
        
      if (error) throw error;
      
      addNotification('Password reset successfully', 'success');
      setShowResetModal(false);
      setSelectedUser(null);
      setResetPasswordData({
        password: '',
        confirmPassword: ''
      });
      
      // Refresh the users list
      fetchUsers();
      
    } catch (err) {
      console.error('Error resetting password:', err);
      addNotification(`Failed to reset password: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      addNotification('User deleted successfully', 'success');
      
      // Refresh the users list
      fetchUsers();
      
    } catch (err) {
      console.error('Error deleting user:', err);
      addNotification(`Failed to delete user: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Alert type="error" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          className="sm:self-start"
          disabled={isSubmitting}
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add User
        </Button>
      </div>
      
      {/* Search and filters */}
      <Card>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </Card>
      
      {/* Users list */}
      <Card>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? "Try a different search term" 
                : "Get started by adding a new user"}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Button onClick={() => setShowAddModal(true)}>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add User
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="mr-2"
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowResetModal(true);
                        }}
                        className="mr-2"
                        disabled={isSubmitting}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isSubmitting || user.id === currentUser?.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => !isSubmitting && setShowAddModal(false)}
        title="Add New User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Full Name"
            value={newUserData.full_name}
            onChange={(e) => setNewUserData({...newUserData, full_name: e.target.value})}
            required
            disabled={isSubmitting}
          />
          
          <Input
            label="Username"
            value={newUserData.username}
            onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
            required
            disabled={isSubmitting}
          />
          
          <Input
            label="Password"
            type="password"
            value={newUserData.password}
            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
            required
            disabled={isSubmitting}
          />
          
          <Input
            label="Confirm Password"
            type="password"
            value={newUserData.confirmPassword}
            onChange={(e) => setNewUserData({...newUserData, confirmPassword: e.target.value})}
            required
            disabled={isSubmitting}
          />
          
          <div className="flex items-center">
            <input
              id="isAdmin"
              type="checkbox"
              checked={newUserData.isAdmin}
              onChange={(e) => setNewUserData({...newUserData, isAdmin: e.target.checked})}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
              Admin User
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isSubmitting && setShowAddModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Add User
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Edit User Modal */}
      {selectedUser && (
        <Modal
          isOpen={showEditModal}
          onClose={() => !isSubmitting && setShowEditModal(false)}
          title="Edit User"
        >
          <form onSubmit={handleEditUser} className="space-y-4">
            <Input
              label="Full Name"
              value={selectedUser.full_name}
              onChange={(e) => setSelectedUser({...selectedUser, full_name: e.target.value})}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="Username"
              value={selectedUser.username}
              disabled={true}
              helpText="Username cannot be changed"
            />
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => !isSubmitting && setShowEditModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Update User
              </Button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Reset Password Modal */}
      {selectedUser && (
        <Modal
          isOpen={showResetModal}
          onClose={() => !isSubmitting && setShowResetModal(false)}
          title="Reset Password"
        >
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <p className="mb-4 text-sm text-gray-500">
                Resetting password for user: <span className="font-medium text-gray-700">{selectedUser.full_name}</span>
              </p>
            </div>
            
            <Input
              label="New Password"
              type="password"
              value={resetPasswordData.password}
              onChange={(e) => setResetPasswordData({...resetPasswordData, password: e.target.value})}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              value={resetPasswordData.confirmPassword}
              onChange={(e) => setResetPasswordData({...resetPasswordData, confirmPassword: e.target.value})}
              required
              disabled={isSubmitting}
            />
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => !isSubmitting && setShowResetModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Reset Password
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;

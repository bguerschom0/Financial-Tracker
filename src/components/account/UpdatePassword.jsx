// src/components/account/UpdatePassword.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { supabase, TABLES } from '../../lib/supabase';
import bcrypt from 'bcryptjs';

const UpdatePassword = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Password strength indicators
  const passwordHasMinLength = formData.newPassword.length >= 8;
  const passwordHasUppercase = /[A-Z]/.test(formData.newPassword);
  const passwordHasLowercase = /[a-z]/.test(formData.newPassword);
  const passwordHasNumber = /\d/.test(formData.newPassword);
  const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    // Check if current password is entered
    if (!formData.currentPassword) {
      addNotification('Current password is required', 'error');
      return false;
    }
    
    // Check if new password meets requirements
    if (!passwordHasMinLength) {
      addNotification('New password must be at least 8 characters', 'error');
      return false;
    }
    
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      addNotification('New passwords do not match', 'error');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Verify current password
      // Note: In a real application, you'd need to implement this on the server side
      // This is a simplified example
      const { data: userData, error: fetchError } = await supabase
        .from(TABLES.USERS)
        .select('password_hash')
        .eq('id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // In a real app, you'd use bcrypt.compare, but for this example:
      const isCurrentPasswordValid = userData.password_hash === formData.currentPassword;
      
      if (!isCurrentPasswordValid) {
        addNotification('Current password is incorrect', 'error');
        return;
      }
      
      // Update password
      // In a real app, you'd hash the new password
      const { error: updateError } = await supabase
        .from(TABLES.USERS)
        .update({
          password_hash: formData.newPassword, // In production, this should be hashed
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      addNotification('Password updated successfully', 'success');
      
    } catch (err) {
      console.error('Error updating password:', err);
      addNotification(`Failed to update password: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card title="Update Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        
        {/* Password strength indicators */}
        {formData.newPassword && (
          <div className="mt-2 space-y-2">
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
        
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        
        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UpdatePassword;

// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Check, X } from 'lucide-react';
import { Button, Modal } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { signUp } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Generate username based on full name
useEffect(() => {
  if (formData.fullName) {
    // Split the full name into parts
    const nameParts = formData.fullName.trim().split(/\s+/);
    
    let username = '';
    
    if (nameParts.length > 1) {
      // Multiple names: Take 6 from first name and 2 from last name
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      
      // Get first 6 characters from first name (or as many as available)
      const firstPart = firstName.substring(0, Math.min(6, firstName.length));
      
      // Get first 2 characters from last name (or as many as available)
      const lastPart = lastName.substring(0, Math.min(2, lastName.length));
      
      // Combine the parts
      username = firstPart + lastPart;
    } else {
      // Single name: Use up to 8 characters from it
      username = nameParts[0].substring(0, Math.min(8, nameParts[0].length));
    }
    
    // Remove special characters and spaces
    username = username.toLowerCase().replace(/[^a-z0-9]/gi, '');
    
    // Ensure username is exactly 8 characters
    if (username.length < 8) {
      // Pad with random numbers if needed
      const padding = Math.random().toString().substring(2, 10);
      username = username + padding.substring(0, 8 - username.length);
    } else if (username.length > 8) {
      // Truncate if longer than 8
      username = username.substring(0, 8);
    }
    
    setFormData(prev => ({ ...prev, username }));
  }
}, [formData.fullName]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.username.trim() || formData.username.length !== 8) {
      newErrors.username = 'Username must be 8 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Save to Fusers table in database
      await signUp({
        username: formData.username,
        password: formData.password,
        metadata: {
          full_name: formData.fullName
        }
      });
      
      addNotification('Account created successfully!', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      addNotification(error.message || 'Failed to create account', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  // Password strength indicators
  const passwordHasMinLength = formData.password.length >= 8;
  const passwordHasUppercase = /[A-Z]/.test(formData.password);
  const passwordHasLowercase = /[a-z]/.test(formData.password);
  const passwordHasNumber = /\d/.test(formData.password);
  const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <DollarSign className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username (auto-generated)
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  readOnly
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your username is automatically generated from your name
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Password strength indicators */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-gray-500">Password strength:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center ${passwordHasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasMinLength ? <Check size={12} className="mr-1" /> : '•'} At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordHasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasUppercase ? <Check size={12} className="mr-1" /> : '•'} Contains uppercase letter
                    </li>
                    <li className={`flex items-center ${passwordHasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasLowercase ? <Check size={12} className="mr-1" /> : '•'} Contains lowercase letter
                    </li>
                    <li className={`flex items-center ${passwordHasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasNumber ? <Check size={12} className="mr-1" /> : '•'} Contains a number
                    </li>
                    <li className={`flex items-center ${passwordHasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordHasSpecialChar ? <Check size={12} className="mr-1" /> : '•'} Contains a special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" onClick={handleTermsClick} className="font-medium text-primary-600 hover:text-primary-500">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms and Conditions"
      >
        <div className="p-4 text-center">
          <p className="text-lg font-medium mb-4">We are still working on our Terms and Conditions.</p>
          <p className="text-gray-500 mb-6">Please check back later for updates.</p>
          <Button onClick={() => setShowTermsModal(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Register;

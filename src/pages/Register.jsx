// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Check } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signUp } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
      await signUp({
        email: formData.email,
        password: formData.password,
        metadata: {
          full_name: formData.fullName
        }
      });
      
      addNotification('Account created successfully! Please check your email to verify your account.', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      addNotification(error.message || 'Failed to create account', 'error');
    } finally {
      setIsLoading(false);
    }
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
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
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
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
    </div>
  );
};

export default Register;

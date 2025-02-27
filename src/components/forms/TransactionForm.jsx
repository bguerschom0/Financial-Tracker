// src/components/forms/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const TransactionForm = ({ 
  type = 'expense',
  initialData = null, 
  onSubmit, 
  onCancel,
  isSubmitting = false,
  defaultCurrency = 'USD'
}) => {
  const defaultData = {
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    notes: '',
    currency: defaultCurrency
  };

  const [formData, setFormData] = useState(initialData || defaultData);
  const [errors, setErrors] = useState({});

  // Update form when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure date is in the correct format
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : defaultData.date,
        // Ensure currency is set
        currency: initialData.currency || defaultCurrency
      });
    } else {
      setFormData({
        ...defaultData,
        currency: defaultCurrency
      });
    }
  }, [initialData, defaultCurrency]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  // Default categories based on transaction type
  const getDefaultCategories = () => {
    if (type === 'income') {
      return [
        'Salary',
        'Freelance',
        'Investments',
        'Rental Income',
        'Side Business',
        'Gifts',
        'Other'
      ];
    } else {
      return [
        'Housing',
        'Transportation',
        'Food',
        'Utilities',
        'Insurance',
        'Healthcare',
        'Entertainment',
        'Personal',
        'Education',
        'Debt',
        'Other'
      ];
    }
  };

  // Available currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'BTC', name: 'Bitcoin' },
    { code: 'ETH', name: 'Ethereum' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.description ? 'border-red-300' : ''
            }`}
            placeholder={`${type === 'income' ? 'Freelance payment' : 'Groceries'}`}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Amount and Currency Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.amount ? 'border-red-300' : ''
              }`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <div className="mt-1">
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.currency ? 'border-red-300' : ''
              }`}
              disabled={isSubmitting}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
            )}
          </div>
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <div className="mt-1">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.category ? 'border-red-300' : ''
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {getDefaultCategories().map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <div className="mt-1">
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.date ? 'border-red-300' : ''
            }`}
            disabled={isSubmitting}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Additional details..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          isLoading={isSubmitting}
        >
          {initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;

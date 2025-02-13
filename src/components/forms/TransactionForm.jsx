// src/components/forms/TransactionForm.jsx
import React, { useState } from 'react';
import { Input, Select, Button } from '../ui';

const TransactionForm = ({ type = 'expense', onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = type === 'expense' 
    ? [
        { value: 'housing', label: 'Housing' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'food', label: 'Food' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'other', label: 'Other' }
      ]
    : [
        { value: 'salary', label: 'Salary' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'investments', label: 'Investments' },
        { value: 'rental', label: 'Rental Income' },
        { value: 'other', label: 'Other' }
      ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
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
        [name]: null
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder={`Enter ${type} description`}
      />

      <Input
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
        placeholder="0.00"
        step="0.01"
        min="0"
      />

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categoryOptions}
        error={errors.category}
      />

      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
      />

      <Input
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Add any additional notes..."
        multiline
      />

      <div className="flex justify-end space-x-3">
        <Button type="submit" variant="primary">
          Save {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;

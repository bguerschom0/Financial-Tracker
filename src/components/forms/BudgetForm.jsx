// src/components/forms/BudgetForm.jsx
import React, { useState } from 'react';
import { Input, Select, Button } from '../ui';

const BudgetForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    category: '',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const [errors, setErrors] = useState({});

  const periodOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const categoryOptions = [
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'food', label: 'Food' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categoryOptions}
        error={errors.category}
      />

      <Input
        label="Budget Amount"
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
        label="Budget Period"
        name="period"
        value={formData.period}
        onChange={handleChange}
        options={periodOptions}
      />

      <Input
        label="Start Date"
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        error={errors.startDate}
      />

      <Input
        label="End Date (Optional)"
        name="endDate"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-3">
        <Button type="submit" variant="primary">
          Save Budget
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;

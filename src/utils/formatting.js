// src/utils/formatting.js

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0.00';
  
  // Parse amount if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

/**
 * Format a date string or Date object to a user-friendly format
 * @param {string|Date} dateInput - Date to format
 * @param {string} format - Format style ('short', 'medium', 'long', 'full')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput, format = 'medium') => {
  if (!dateInput) return 'N/A';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const options = {};
    
    switch (format) {
      case 'short':
        options.month = 'numeric';
        options.day = 'numeric';
        options.year = '2-digit';
        break;
      case 'medium':
        options.month = 'short';
        options.day = 'numeric';
        options.year = 'numeric';
        break;
      case 'long':
        options.month = 'long';
        options.day = 'numeric';
        options.year = 'numeric';
        break;
      case 'full':
        options.weekday = 'long';
        options.month = 'long';
        options.day = 'numeric';
        options.year = 'numeric';
        break;
      default:
        options.month = 'short';
        options.day = 'numeric';
        options.year = 'numeric';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

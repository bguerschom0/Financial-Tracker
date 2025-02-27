// src/components/ui/CurrencySelector.jsx
import React from 'react';

// List of supported currencies with their details
const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' }
];

const CurrencySelector = ({ 
  value = 'USD', 
  onChange, 
  className = '', 
  disabled = false,
  showSymbol = true,
  showFullName = true,
  error = false
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
        error ? 'border-red-300' : ''
      } ${className}`}
      disabled={disabled}
    >
      {SUPPORTED_CURRENCIES.map(currency => (
        <option key={currency.code} value={currency.code}>
          {showSymbol && currency.symbol} {currency.code} 
          {showFullName && ` - ${currency.name}`}
        </option>
      ))}
    </select>
  );
};

// Export the component and the currencies list for reuse
export default CurrencySelector;
export { SUPPORTED_CURRENCIES };

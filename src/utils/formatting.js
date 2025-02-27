// src/utils/formatting.js

/**
 * Get currency configuration for formatting
 * @param {string} currencyCode - ISO currency code
 * @returns {Object} Currency configuration
 */
export const getCurrencyConfig = (currencyCode = 'USD') => {
  const currencies = {
    USD: { locale: 'en-US', symbol: '$', position: 'before', decimalPlaces: 2 },
    EUR: { locale: 'de-DE', symbol: '€', position: 'after', decimalPlaces: 2 },
    GBP: { locale: 'en-GB', symbol: '£', position: 'before', decimalPlaces: 2 },
    JPY: { locale: 'ja-JP', symbol: '¥', position: 'before', decimalPlaces: 0 },
    CNY: { locale: 'zh-CN', symbol: '¥', position: 'before', decimalPlaces: 2 },
    INR: { locale: 'en-IN', symbol: '₹', position: 'before', decimalPlaces: 2 },
    RWF: { locale: 'rw-RW', symbol: 'FRw', position: 'after', decimalPlaces: 0 },
    NGN: { locale: 'en-NG', symbol: '₦', position: 'before', decimalPlaces: 2 },
    KES: { locale: 'en-KE', symbol: 'KSh', position: 'before', decimalPlaces: 2 },
    ZAR: { locale: 'en-ZA', symbol: 'R', position: 'before', decimalPlaces: 2 },
    GHS: { locale: 'en-GH', symbol: 'GH₵', position: 'before', decimalPlaces: 2 },
    BTC: { locale: 'en-US', symbol: '₿', position: 'before', decimalPlaces: 8 },
    ETH: { locale: 'en-US', symbol: 'Ξ', position: 'before', decimalPlaces: 6 },
  };
  
  return currencies[currencyCode] || currencies.USD;
};

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: USD)
 * @param {boolean} useNativeFormat - Whether to use Intl.NumberFormat (true) or custom formatting (false)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD', useNativeFormat = true) => {
  if (amount === null || amount === undefined) {
    const config = getCurrencyConfig(currencyCode);
    return config.position === 'before' 
      ? `${config.symbol}0` 
      : `0 ${config.symbol}`;
  }
  
  // Parse amount if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Get currency configuration
  const config = getCurrencyConfig(currencyCode);
  
  if (useNativeFormat) {
    try {
      // Use native Intl.NumberFormat for standard formatting
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: config.decimalPlaces,
        maximumFractionDigits: config.decimalPlaces
      }).format(numAmount);
    } catch (error) {
      console.error('Error using Intl.NumberFormat, falling back to custom formatter:', error);
      // Fall back to custom formatting if native format fails
      useNativeFormat = false;
    }
  }
  
  if (!useNativeFormat) {
    // Custom formatter as fallback
    const formatted = numAmount.toFixed(config.decimalPlaces);
    
    // Add thousand separators
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    const numberPart = parts.join('.');
    
    // Position the currency symbol according to configuration
    return config.position === 'before' 
      ? `${config.symbol}${numberPart}` 
      : `${numberPart} ${config.symbol}`;
  }
};

/**
 * Format a date string or Date object to a user-friendly format
 * @param {string|Date} dateInput - Date to format
 * @param {string} format - Format style ('short', 'medium', 'long', 'full')
 * @param {string} locale - Locale for date formatting (default: en-US)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput, format = 'medium', locale = 'en-US') => {
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
    
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

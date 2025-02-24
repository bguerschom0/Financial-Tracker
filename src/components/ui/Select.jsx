// src/components/ui/Select.jsx
import React from 'react';

const Select = ({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select 
                  id={selectId}
        className={`
          block w-full rounded-md shadow-sm appearance-none
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${selectId}-error` : helperText ? `${selectId}-description` : undefined
        }
        {...props}
      >
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p 
          id={`${selectId}-error`} 
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      ) : helperText ? (
        <p 
          id={`${selectId}-description`} 
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Select;

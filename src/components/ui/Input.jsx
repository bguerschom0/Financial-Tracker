// src/components/ui/Input.jsx
import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          className={`
            block w-full rounded-md shadow-sm
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined
          }
          {...props}
        />
      </div>
      {error ? (
        <p 
          id={`${inputId}-error`} 
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      ) : helperText ? (
        <p 
          id={`${inputId}-description`} 
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Input;

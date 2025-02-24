// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  actions,
  className = '',
  noPadding = false,
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden
        transition-shadow duration-200 ease-in-out hover:shadow-md
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'px-6 py-4'}>
        {children}
      </div>
    </div>
  );
};

export default Card;

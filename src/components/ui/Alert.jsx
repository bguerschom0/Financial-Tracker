// src/components/ui/Alert.jsx
import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const styles = {
    info: 'bg-blue-50 text-blue-800',
    success: 'bg-green-50 text-green-800',
    warning: 'bg-yellow-50 text-yellow-800',
    error: 'bg-red-50 text-red-800',
  };

  const Icon = icons[type];

  return (
    <div 
      className={`rounded-md p-4 ${styles[type]} ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <XCircle className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;

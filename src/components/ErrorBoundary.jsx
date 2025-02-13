// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error details:', {
      error: error,
      errorInfo: errorInfo,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-gray-700 mb-2">Error: {this.state.error?.message}</p>
              <details className="cursor-pointer">
                <summary className="text-blue-600 hover:text-blue-800">View technical details</summary>
                <pre className="mt-2 p-4 bg-gray-800 text-white rounded-md overflow-x-auto">
                  {this.state.error?.stack}
                </pre>
                <pre className="mt-2 p-4 bg-gray-800 text-white rounded-md overflow-x-auto">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

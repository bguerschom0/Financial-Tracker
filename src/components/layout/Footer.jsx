// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Financial Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

// src/components/layout/Footer.jsx
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Financial Tracker. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-2 sm:mt-0">
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setShowTermsModal(true)}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <div className="p-6">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              We're working on our Privacy Policy
            </h3>
            <p className="text-gray-500">
              Our team is currently drafting a comprehensive privacy policy to ensure your data is protected.
              Please check back soon for updates.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setShowPrivacyModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
      >
        <div className="p-6">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              We're working on our Terms of Service
            </h3>
            <p className="text-gray-500">
              Our legal team is currently finalizing our terms of service. 
              The document will be available soon.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setShowTermsModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;

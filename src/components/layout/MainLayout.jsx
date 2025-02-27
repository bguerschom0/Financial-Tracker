// src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import AutoLogout from './AutoLogout';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Auto Logout Component */}
      <AutoLogout />
      
      {/* Mobile sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-4 md:p-6">
          <div className="max-w-7xl mx-auto pb-16"> {/* Added padding at bottom for footer space */}
            <Outlet />
          </div>
        </main>

        {/* Footer is now fixed at the bottom */}
        <div className="flex-shrink-0">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

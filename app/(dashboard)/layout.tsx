import React from 'react';
import Navbar from './__components/Navbar';
import Sidebar from './__components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full ">
      {/* Header */}
      <header className="h-20  w-full fixed top-0 z-50">
        <Navbar />
      </header>

      {/* Sidebar */}
      <div className="hidden md:flex h-full w-56 fixed left-0 top-20">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="pt-20 md:pl-56">{children}</main>
    </div>
  );
};

export default DashboardLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-5 overflow-y-auto max-w-[1700px] w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
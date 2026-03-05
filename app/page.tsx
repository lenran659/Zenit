'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';
import CommandPalette from './components/CommandPalette';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'tasks':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {renderPage()}
      </div>
      <CommandPalette />
    </div>
  );
}

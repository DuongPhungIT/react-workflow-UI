// App Layout component with header and sidebar

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Button from '@/components/Button';
import Sidebar from '@/components/Sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import './AppLayout.less';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isWorkflowPage = location.pathname.startsWith('/workflow');
  const [sidebarOpen, setSidebarOpen] = useLocalStorage<boolean>('sidebarOpen', true);
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <div className="app-layout__container">
          <div className="app-layout__header-content">
            <div className="app-layout__header-left">
              <Link to="/" className="app-layout__logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logo-gradient)" />
                  <path d="M10 16C10 16 12 12 16 12C20 12 22 16 22 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 12V20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10" cy="16" r="2" fill="white" />
                  <circle cx="22" cy="16" r="2" fill="white" />
                  <circle cx="16" cy="20" r="2" fill="white" />
                  <defs>
                    <linearGradient id="logo-gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6"/>
                      <stop offset="1" stopColor="#8b5cf6"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>Workflow UI</span>
              </Link>
            </div>
            <div className="app-layout__header-right">
              {isWorkflowPage && (
                <Link to="/">
                  <Button variant="outline" size="sm">
                    Back to List
                  </Button>
                  </Link>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="theme-toggle-btn"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="app-layout__body">
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
        <main className={sidebarOpen ? 'app-layout__main' : 'app-layout__main app-layout__main--sidebar-closed'}>
          <div className="app-layout__container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;


// Sidebar component with navigation menu

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import './styles.less';

interface MenuItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems: MenuItem[] = [
  {
    path: '/',
    label: 'Workflows',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    path: '/builder',
    label: 'Builder',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!isOpen && (
        <div className="sidebar__overlay" onClick={onClose} />
      )}
      <aside className={cn('sidebar', !isOpen && 'sidebar--collapsed')}>
        <nav className="sidebar__nav">
          <ul className="sidebar__menu">
            {menuItems.map((item) => (
              <li key={item.path} className="sidebar__menu-item">
                <Link
                  to={item.path}
                  className={cn(
                    'sidebar__link',
                    isActive(item.path) && 'sidebar__link--active'
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  {item.icon && <span className="sidebar__icon">{item.icon}</span>}
                  <span className="sidebar__label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logo Section - at bottom */}
        <div className="sidebar__logo">
          <button
            className="sidebar__logo-link"
            onClick={onClose}
            type="button"
            aria-label="Toggle sidebar"
          >
            <div className="sidebar__logo-icon">
              {isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiGrid, FiCalendar, FiBook, FiBarChart2, FiSettings, FiLogOut, FiMail } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { FaRegUserCircle } from "react-icons/fa";

import './../styles/navbar.css';

function Navbar({ title = 'Smart Study Planner' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
      </div>

      <nav className="topbar-nav" aria-label="Primary">
        <Link
          to="/dashboard"
          className={`topbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <FiGrid /> Dashboard
        </Link>
        <Link
          to="/planner"
          className={`topbar-link ${location.pathname === '/planner' ? 'active' : ''}`}
        >
          <FiCalendar /> Planner
        </Link>
        <Link
          to="/resources"
          className={`topbar-link ${location.pathname === '/resources' ? 'active' : ''}`}
        >
          <FiBook /> Resources
        </Link>
        <Link
          to="/analytics"
          className={`topbar-link ${location.pathname === '/analytics' ? 'active' : ''}`}
        >
          <FiBarChart2 /> Analytics
        </Link>
        <Link
          to="/settings"
          className={`topbar-link ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <FiSettings /> Settings
        </Link>
      </nav>

      <div className="topbar-right">
        <ThemeToggle />
        <button type="button" className="topbar-icon-btn" aria-label="Notifications">
          <span className="topbar-badge">3</span>
          <FiBell />
        </button>
        <button type="button" className="topbar-icon-btn" aria-label="Messages">
          <FiMail />
        </button>

        <div className="topbar-user">
          <div className="topbar-avatar" aria-hidden="true">
            {(user.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="topbar-user-pill">
            <span className="topbar-name">{user.name || 'User'}</span>
            <FaRegUserCircle />
          </div>
        </div>

        <button type="button" className="topbar-icon-btn" onClick={handleLogout} aria-label="Logout">
          <FiLogOut />
        </button>
      </div>
    </header>
  );
}

export default Navbar;

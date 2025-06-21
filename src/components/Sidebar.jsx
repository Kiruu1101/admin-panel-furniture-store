import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div style={{ display: 'flex' }}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/products"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Orders
          </NavLink>
        </nav>
      </aside>

      <main style={{ marginLeft: '300px', padding: '20px', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;

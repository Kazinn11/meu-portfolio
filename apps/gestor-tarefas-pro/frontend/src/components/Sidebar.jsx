import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, LogOut, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--glass-border)',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div className="logo" style={{ padding: '0 1rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>TaskPro</h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink to="/tasks" icon={<CheckSquare size={20} />} label="Minhas Tarefas" />
        <SidebarLink to="/calendar" icon={<Calendar size={20} />} label="Calendário" />
      </nav>

      <div className="footer-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SidebarLink to="/settings" icon={<Settings size={20} />} label="Configurações" />
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.8rem 1rem',
          color: 'var(--text-secondary)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '10px',
          width: '100%',
          textAlign: 'left',
          transition: 'var(--transition)'
        }}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.8rem 1rem',
      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
      background: isActive ? 'rgba(0, 210, 255, 0.08)' : 'transparent',
      borderRadius: '10px',
      textDecoration: 'none',
      transition: 'var(--transition)',
      borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
    })}
  >
    {icon}
    <span style={{ fontWeight: 500 }}>{label}</span>
  </NavLink>
);

export default Sidebar;

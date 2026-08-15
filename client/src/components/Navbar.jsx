import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, PlusCircle, ShieldCheck, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <Link to="/" style={styles.brand}>
          <div style={styles.logoBadge}>
            <Briefcase size={22} color="#ffffff" />
          </div>
          <span style={styles.brandText}>JOB<span style={{ color: '#6366f1' }}>HUB</span></span>
        </Link>

        {/* Links */}
        <nav style={styles.navLinks}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/jobs" style={styles.link}>
            <Search size={16} style={{ marginRight: '4px' }} />
            Browse Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {user.role === 'jobseeker' && (
                <Link to="/jobseeker/dashboard" style={styles.link}>
                  <LayoutDashboard size={16} style={{ marginRight: '4px' }} />
                  Dashboard
                </Link>
              )}

              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" style={styles.link}>
                    <LayoutDashboard size={16} style={{ marginRight: '4px' }} />
                    Dashboard
                  </Link>
                  <Link to="/employer/jobs/create" className="btn btn-primary btn-sm">
                    <PlusCircle size={16} />
                    Post Job
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
                  <ShieldCheck size={16} />
                  Admin Panel
                </Link>
              )}

              {/* User Profile Pill */}
              <div style={styles.userProfile}>
                <div style={styles.userAvatar}>
                  <User size={16} color="#6366f1" />
                </div>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{user.name}</span>
                  <span className={`badge ${
                    user.role === 'admin'
                      ? 'badge-danger'
                      : user.role === 'employer'
                      ? 'badge-cyan'
                      : 'badge-indigo'
                  }`}>
                    {user.role}
                  </span>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                  <LogOut size={18} color="#9ca3af" />
                </button>
              </div>
            </>
          ) : (
            <div style={styles.authBtnGroup}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'rgba(11, 15, 25, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    textDecoration: 'none'
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
  },
  brandText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    color: '#ffffff'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    color: '#9ca3af',
    fontWeight: '500',
    fontSize: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'color 0.2s ease'
  },
  authBtnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '0.35rem 0.75rem',
    borderRadius: '9999px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#f3f4f6'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Code, Database, Server, Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.content}>
        <div style={styles.topRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={styles.logoBadge}>
                <Briefcase size={18} color="#ffffff" />
              </div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: '800' }}>
                JOB<span style={{ color: '#6366f1' }}>HUB</span>
              </span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '360px' }}>
              Demonstrating MVC Architecture in MERN Stack. Separating public job browsing from role-protected employer and admin operations.
            </p>
          </div>

          <div style={styles.mvcBadges}>
            <div style={styles.mvcItem}>
              <Database size={16} color="#06b6d4" />
              <span><strong>Model:</strong> MongoDB Schema</span>
            </div>
            <div style={styles.mvcItem}>
              <Layers size={16} color="#6366f1" />
              <span><strong>View:</strong> React UI Components</span>
            </div>
            <div style={styles.mvcItem}>
              <Server size={16} color="#10b981" />
              <span><strong>Controller:</strong> Express API Logic</span>
            </div>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <p>© 2026 JOBHUB — MERN MVC Job Portal. Built for academic demonstration.</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/login">Employer Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#070a12',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '3rem 0 1.5rem 0',
    marginTop: 'auto'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem'
  },
  logoBadge: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mvcBadges: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  mvcItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem',
    color: '#d1d5db'
  },
  bottomRow: {
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#6b7280'
  }
};

export default Footer;

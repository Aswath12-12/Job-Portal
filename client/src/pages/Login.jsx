import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Briefcase, UserCheck, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await login({ email, password });
      const role = res.data.role;

      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'employer') {
        navigate('/employer/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/jobseeker/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick fill helper for local assignment testing
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', maxWidth: '520px' }}>
      <div className="glass-card" style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={styles.iconCircle}>
            <LogIn size={26} color="#6366f1" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.75rem' }}>Welcome Back</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Login to manage your job listings or applications
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Account Shortcut Pill Buttons */}
        <div style={styles.demoSection}>
          <div style={styles.demoTitle}>Quick Demo Login Shortcuts:</div>
          <div style={styles.demoGroup}>
            <button
              onClick={() => fillDemoAccount('employer@tech.com', 'employer123')}
              className="btn btn-secondary btn-sm"
              type="button"
            >
              <Briefcase size={14} color="#06b6d4" /> Employer Demo
            </button>

            <button
              onClick={() => fillDemoAccount('student@example.com', 'student123')}
              className="btn btn-secondary btn-sm"
              type="button"
            >
              <UserCheck size={14} color="#6366f1" /> Job Seeker Demo
            </button>

            <button
              onClick={() => fillDemoAccount('admin@jobportal.com', 'admin123')}
              className="btn btn-secondary btn-sm"
              type="button"
            >
              <ShieldCheck size={14} color="#ef4444" /> Admin Demo
            </button>
          </div>
        </div>

        <div style={styles.footerLink}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: '600' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '2.5rem'
  },
  iconCircle: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  demoSection: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  demoTitle: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  demoGroup: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  footerLink: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#9ca3af'
  }
};

export default Login;

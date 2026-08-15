import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Briefcase, UserCheck } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await register({
        name,
        email,
        password,
        role,
        companyName: role === 'employer' ? companyName : ''
      });

      if (res.data.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/jobseeker/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', maxWidth: '560px' }}>
      <div className="glass-card" style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={styles.iconCircle}>
            <UserPlus size={26} color="#6366f1" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.75rem' }}>Create Account</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Select your account type to get started on JOBHUB
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Role Selector Cards */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: '500' }}>
              I want to register as a:
            </label>

            <div style={styles.roleSelectorGrid}>
              <div
                style={{
                  ...styles.roleOption,
                  borderColor: role === 'jobseeker' ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                  background: role === 'jobseeker' ? 'rgba(99, 102, 241, 0.12)' : 'transparent'
                }}
                onClick={() => setRole('jobseeker')}
              >
                <UserCheck size={22} color={role === 'jobseeker' ? '#6366f1' : '#9ca3af'} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Job Seeker</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Apply for open roles</div>
                </div>
              </div>

              <div
                style={{
                  ...styles.roleOption,
                  borderColor: role === 'employer' ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)',
                  background: role === 'employer' ? 'rgba(6, 182, 212, 0.12)' : 'transparent'
                }}
                onClick={() => setRole('employer')}
              >
                <Briefcase size={22} color={role === 'employer' ? '#06b6d4' : '#9ca3af'} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Employer</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Post jobs & hire</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {role === 'employer' && (
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acme Technologies Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required={role === 'employer'}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password (Min 6 characters) *</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={styles.footerLink}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: '600' }}>
            Login here
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
  roleSelectorGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  roleOption: {
    padding: '1rem',
    borderRadius: '10px',
    border: '2px solid',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s ease'
  },
  footerLink: {
    marginTop: '1.75rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#9ca3af'
  }
};

export default Register;

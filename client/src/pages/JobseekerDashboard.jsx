import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CheckCircle2, Clock, MapPin, Building, ChevronRight, FileText, LayoutDashboard } from 'lucide-react';

const JobseekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const res = await fetchMyApplications();
        setApplications(res.data.data);
      } catch (err) {
        console.error('Failed to load candidate applications:', err);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Under Review':
        return <span className="badge badge-warning">Under Review</span>;
      case 'Shortlisted':
        return <span className="badge badge-cyan">Shortlisted</span>;
      case 'Selected':
        return <span className="badge badge-emerald">Selected 🎉</span>;
      case 'Rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-indigo">Applied</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
            <LayoutDashboard size={14} /> Candidate Dashboard — {user?.name}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>My Applications & Activity</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Track the status of your submitted job applications in real-time.
          </p>
        </div>

        <Link to="/jobs" className="btn btn-primary">
          <Briefcase size={18} /> Browse More Jobs
        </Link>
      </div>

      {/* Metrics Stat Grid */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(99, 102, 241, 0.15)' }}>
            <FileText size={22} color="#6366f1" />
          </div>
          <div>
            <div style={styles.statVal}>{applications.length}</div>
            <div style={styles.statLabel}>Total Jobs Applied</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(245, 158, 11, 0.15)' }}>
            <Clock size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={styles.statVal}>
              {applications.filter((a) => a.status === 'Applied' || a.status === 'Under Review').length}
            </div>
            <div style={styles.statLabel}>Pending / Under Review</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div>
            <div style={styles.statVal}>
              {applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Selected').length}
            </div>
            <div style={styles.statLabel}>Shortlisted / Offers</div>
          </div>
        </div>
      </div>

      {/* Application Table / Card List */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Submitted Applications</h2>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : applications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => {
            const job = app.job || {};
            return (
              <div key={app._id} className="glass-card" style={styles.appCard}>
                <div style={styles.appMain}>
                  <div style={styles.companyIcon}>
                    <Building size={22} color="#6366f1" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{job.title || 'Job Title Unavailable'}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <div style={styles.metaRow}>
                      <span style={{ fontWeight: '600', color: '#9ca3af' }}>{job.company || 'Company'}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={14} color="#9ca3af" /> {job.location || 'Location'}
                      </span>
                      <span>•</span>
                      <span>Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.appAction}>
                  {job._id && (
                    <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm">
                      View Job Details <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyBox}>
          <FileText size={44} color="#6b7280" />
          <h3 style={{ marginTop: '1rem' }}>No Applications Found</h3>
          <p style={{ color: '#9ca3af', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            You haven't applied to any job postings yet. Explore open roles and submit your application!
          </p>
          <Link to="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '1.25rem' }}>
            Browse Jobs Now
          </Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  statCard: {
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statVal: {
    fontSize: '1.6rem',
    fontWeight: '800',
    lineHeight: '1.1'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    marginTop: '0.15rem'
  },
  appCard: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  appMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1
  },
  companyIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem',
    color: '#9ca3af',
    marginTop: '0.2rem',
    flexWrap: 'wrap'
  },
  emptyBox: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default JobseekerDashboard;

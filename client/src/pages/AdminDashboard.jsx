import React, { useState, useEffect } from 'react';
import {
  fetchAdminStats,
  fetchAllUsers,
  fetchAllJobsAdmin,
  deleteJobAdmin,
  fetchAllApplicationsAdmin
} from '../services/api';
import { ShieldCheck, Users, Briefcase, FileText, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, jobsRes, appsRes] = await Promise.all([
        fetchAdminStats(),
        fetchAllUsers(),
        fetchAllJobsAdmin(),
        fetchAllApplicationsAdmin()
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setJobs(jobsRes.data.data);
      setApplications(appsRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`[ADMIN CONFIRMATION] Are you sure you want to remove job "${jobTitle}" from the platform?`)) {
      try {
        await deleteJobAdmin(jobId);
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        loadData(); // refresh stats
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete job as admin');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>
          <ShieldCheck size={14} /> System Administrator Portal
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Admin Operations Dashboard</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
          Monitor system metrics, review registered users, moderate job postings, and audit applications.
        </p>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(99, 102, 241, 0.15)' }}>
              <Users size={22} color="#6366f1" />
            </div>
            <div>
              <div style={styles.statVal}>{stats.totalUsers}</div>
              <div style={styles.statLabel}>Total Users ({stats.totalEmployers} Employers)</div>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(6, 182, 212, 0.15)' }}>
              <Briefcase size={22} color="#06b6d4" />
            </div>
            <div>
              <div style={styles.statVal}>{stats.totalJobs}</div>
              <div style={styles.statLabel}>Total Jobs ({stats.activeJobs} Active)</div>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.15)' }}>
              <FileText size={22} color="#10b981" />
            </div>
            <div>
              <div style={styles.statVal}>{stats.totalApplications}</div>
              <div style={styles.statLabel}>Total Applications</div>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: 'rgba(239, 68, 68, 0.15)' }}>
              <ShieldCheck size={22} color="#ef4444" />
            </div>
            <div>
              <div style={styles.statVal}>Active</div>
              <div style={styles.statLabel}>Platform Moderation Status</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            ...styles.tabBtn,
            borderColor: activeTab === 'users' ? '#6366f1' : 'transparent',
            color: activeTab === 'users' ? '#ffffff' : '#9ca3af'
          }}
        >
          <Users size={16} /> Registered Users ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            ...styles.tabBtn,
            borderColor: activeTab === 'jobs' ? '#06b6d4' : 'transparent',
            color: activeTab === 'jobs' ? '#ffffff' : '#9ca3af'
          }}
        >
          <Briefcase size={16} /> Job Listings ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          style={{
            ...styles.tabBtn,
            borderColor: activeTab === 'applications' ? '#10b981' : 'transparent',
            color: activeTab === 'applications' ? '#ffffff' : '#9ca3af'
          }}
        >
          <FileText size={16} /> Platform Applications ({applications.length})
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          {/* TAB 1: USERS */}
          {activeTab === 'users' && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={styles.tr}>
                    <td style={styles.td}><strong>{u.name}</strong></td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span className={`badge ${
                        u.role === 'admin' ? 'badge-danger' : u.role === 'employer' ? 'badge-cyan' : 'badge-indigo'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={styles.td}>{u.companyName || '—'}</td>
                    <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: JOBS */}
          {activeTab === 'jobs' && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j._id} style={styles.tr}>
                    <td style={styles.td}><strong>{j.title}</strong></td>
                    <td style={styles.td}>{j.company}</td>
                    <td style={styles.td}>{j.category}</td>
                    <td style={styles.td}>{j.jobType}</td>
                    <td style={styles.td}>
                      <span className={`badge ${j.status === 'active' ? 'badge-emerald' : 'badge-danger'}`}>
                        {j.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDeleteJob(j._id, j.title)}
                        className="btn btn-danger btn-sm"
                        title="Delete Job as Admin"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: APPLICATIONS */}
          {activeTab === 'applications' && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Applicant</th>
                  <th style={styles.th}>Applicant Email</th>
                  <th style={styles.th}>Job Title</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} style={styles.tr}>
                    <td style={styles.td}><strong>{app.applicant?.name || 'Unknown'}</strong></td>
                    <td style={styles.td}>{app.applicant?.email || '—'}</td>
                    <td style={styles.td}>{app.job?.title || 'Job Deleted'}</td>
                    <td style={styles.td}>{app.job?.company || '—'}</td>
                    <td style={styles.td}>
                      <span className="badge badge-indigo">{app.status}</span>
                    </td>
                    <td style={styles.td}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
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
    fontSize: '1.5rem',
    fontWeight: '800',
    lineHeight: '1.1'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    marginTop: '0.15rem'
  },
  tabBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '0.75rem 1rem',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.9rem'
  },
  th: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: '0.8rem',
    textTransform: 'uppercase'
  },
  td: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    color: '#d1d5db'
  },
  tr: {
    transition: 'background 0.2s ease'
  }
};

export default AdminDashboard;

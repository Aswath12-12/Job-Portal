import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEmployerJobs, deleteJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import { Briefcase, PlusCircle, Users, CheckCircle2, XCircle, LayoutDashboard } from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmployerJobs = async () => {
    try {
      const res = await fetchEmployerJobs();
      setJobs(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employer jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployerJobs();
  }, []);

  const handleDelete = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}"? This will also delete all candidate applications for this job.`)) {
      try {
        await deleteJob(jobId);
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  // Metrics calculation
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const closedJobs = jobs.filter((j) => j.status === 'closed').length;
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Dashboard Top Header */}
      <div style={styles.headerRow}>
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
            <LayoutDashboard size={14} /> Employer Workspace — {user?.companyName || user?.name}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Employer Dashboard</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Manage your posted jobs, track candidate applications, and publish new openings.
          </p>
        </div>

        <Link to="/employer/jobs/create" className="btn btn-primary btn-lg">
          <PlusCircle size={18} /> Post New Job
        </Link>
      </div>

      {/* Metrics Stat Grid */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(99, 102, 241, 0.15)' }}>
            <Briefcase size={22} color="#6366f1" />
          </div>
          <div>
            <div style={styles.statVal}>{totalJobs}</div>
            <div style={styles.statLabel}>Total Posted Jobs</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.15)' }}>
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div>
            <div style={styles.statVal}>{activeJobs}</div>
            <div style={styles.statLabel}>Active Job Listings</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(239, 68, 68, 0.15)' }}>
            <XCircle size={22} color="#ef4444" />
          </div>
          <div>
            <div style={styles.statVal}>{closedJobs}</div>
            <div style={styles.statLabel}>Closed Listings</div>
          </div>
        </div>

        <div className="glass-card" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(6, 182, 212, 0.15)' }}>
            <Users size={22} color="#06b6d4" />
          </div>
          <div>
            <div style={styles.statVal}>{totalApplications}</div>
            <div style={styles.statLabel}>Total Applications Received</div>
          </div>
        </div>
      </div>

      {/* Posted Jobs List */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Job Postings</h2>
        <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Only visible to your employer account</span>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : jobs.length > 0 ? (
        <div className="grid-2">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isEmployerOwner={true} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyBox}>
          <Briefcase size={44} color="#6b7280" />
          <h3 style={{ marginTop: '1rem' }}>No Jobs Posted Yet</h3>
          <p style={{ color: '#9ca3af', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Click the "Post New Job" button above to publish your first hiring opening.
          </p>
          <Link to="/employer/jobs/create" className="btn btn-primary btn-sm" style={{ marginTop: '1.25rem' }}>
            Post A Job Now
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
  emptyBox: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default EmployerDashboard;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJobApplications, updateApplicationStatus } from '../services/api';
import { ArrowLeft, Users, CheckCircle, AlertCircle, FileText, Mail, Calendar } from 'lucide-react';

const JobApplications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadApplications = async () => {
    try {
      const res = await fetchJobApplications(id);
      setApplications(res.data.data);
      setJobTitle(res.data.jobTitle || 'Job Applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidate applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <Link to="/employer/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Employer Dashboard
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
          <Users size={14} /> Employer Candidate Review
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Applications for "{jobTitle}"</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
          Review candidate resumes, cover letters, and update candidate progress status.
        </p>
      </div>

      {error ? (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : applications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map((app) => (
            <div key={app._id} className="glass-card" style={styles.appCard}>
              <div style={styles.headerRow}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                    {app.applicant?.name || 'Applicant'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    <Mail size={14} /> {app.applicant?.email}
                    <span>•</span>
                    <Calendar size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={styles.statusGroup}>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '600' }}>Candidate Status:</label>
                  <select
                    className="form-control"
                    value={app.status}
                    disabled={updatingId === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    style={{ minWidth: '150px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div style={styles.detailBox}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase' }}>Resume / Qualifications:</span>
                  <p style={{ color: '#67e8f9', fontWeight: '500', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                    {app.resume}
                  </p>
                </div>

                {app.coverLetter && (
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase' }}>Cover Letter:</span>
                    <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginTop: '0.2rem', lineHeight: '1.6' }}>
                      {app.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#9ca3af' }}>
          <FileText size={44} color="#6b7280" />
          <h3 style={{ marginTop: '1rem', color: '#ffffff' }}>No Applications Received Yet</h3>
          <p style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Candidates applying to this job posting will appear here in real-time.
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  appCard: {
    padding: '1.75rem'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.25rem'
  },
  statusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
  },
  detailBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  }
};

export default JobApplications;

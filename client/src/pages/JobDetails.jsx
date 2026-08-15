import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJobById, applyForJob, deleteJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Send,
  Edit3,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(null);

  useEffect(() => {
    const getJob = async () => {
      try {
        const res = await fetchJobById(id);
        setJob(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    getJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyError(null);
    setSubmitting(true);

    try {
      await applyForJob({
        jobId: job._id,
        resume,
        coverLetter
      });
      setApplySuccess('Application submitted successfully!');
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(null);
        navigate('/jobseeker/dashboard');
      }, 1800);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      try {
        await deleteJob(job._id);
        navigate('/employer/dashboard');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  if (loading) return <div className="spinner"></div>;

  if (error || !job) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 style={{ marginTop: '1rem' }}>Job Posting Not Found</h2>
          <p style={{ color: '#9ca3af', margin: '0.5rem 0 1.5rem 0' }}>{error}</p>
          <Link to="/jobs" className="btn btn-secondary">
            Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  const isEmployerOwner =
    user && (user.role === 'admin' || (user.role === 'employer' && job.employer?._id === user._id));

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Header Banner Card */}
      <div className="glass-card" style={styles.bannerCard}>
        <div style={styles.headerTop}>
          <div style={styles.companyMeta}>
            <div style={styles.companyIcon}>
              <Building size={28} color="#6366f1" />
            </div>
            <div>
              <span style={styles.companyName}>{job.company}</span>
              <h1 style={styles.jobTitle}>{job.title}</h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-indigo">{job.jobType}</span>
            <span className="badge badge-cyan">{job.category}</span>
            {job.status === 'closed' && <span className="badge badge-danger">Closed</span>}
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <MapPin size={18} color="#9ca3af" />
            <div>
              <span style={styles.statLabel}>Location</span>
              <span style={styles.statVal}>{job.location}</span>
            </div>
          </div>

          <div style={styles.statItem}>
            <DollarSign size={18} color="#10b981" />
            <div>
              <span style={styles.statLabel}>Salary Compensation</span>
              <span style={{ ...styles.statVal, color: '#10b981' }}>
                ${job.salaryMin ? job.salaryMin.toLocaleString() : '0'} - ${job.salaryMax ? job.salaryMax.toLocaleString() : '0'} / year
              </span>
            </div>
          </div>

          <div style={styles.statItem}>
            <Calendar size={18} color="#9ca3af" />
            <div>
              <span style={styles.statLabel}>Posted Date</span>
              <span style={styles.statVal}>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Button Section based on Auth Role */}
        <div style={styles.actionRow}>
          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-primary btn-lg">
              Login to Apply for Job
            </Link>
          ) : user.role === 'jobseeker' ? (
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn btn-primary btn-lg"
              disabled={job.status === 'closed'}
            >
              <Send size={18} />
              {job.status === 'closed' ? 'Job Posting Closed' : 'Apply Now'}
            </button>
          ) : isEmployerOwner ? (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={`/jobs/${job._id}/applications`} className="btn btn-primary">
                <Users size={18} />
                View Applications
              </Link>
              <Link to={`/employer/jobs/edit/${job._id}`} className="btn btn-secondary">
                <Edit3 size={18} color="#67e8f9" />
                Edit Job
              </Link>
              <button onClick={handleDeleteJob} className="btn btn-danger">
                <Trash2 size={18} />
                Delete Job
              </button>
            </div>
          ) : (
            <div className="badge badge-warning" style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}>
              Logged in as Employer ({user.companyName || user.name}). Switching to preview mode.
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={styles.detailsGrid}>
        <div className="glass-card" style={styles.contentCard}>
          <h2 style={styles.sectionHeading}>Job Description</h2>
          <p style={styles.bodyText}>{job.description}</p>

          <h2 style={{ ...styles.sectionHeading, marginTop: '2rem' }}>Requirements & Qualifications</h2>
          <p style={styles.bodyText}>{job.requirements}</p>

          <h2 style={{ ...styles.sectionHeading, marginTop: '2rem' }}>Required Skills</h2>
          <div style={styles.skillsWrapper}>
            {job.skills &&
              job.skills.map((skill, idx) => (
                <span key={idx} className="badge badge-indigo" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="glass-card" style={styles.sidebarCard}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>About Employer</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={styles.companyIconSmall}>
              <Building size={20} color="#6366f1" />
            </div>
            <div>
              <div style={{ fontWeight: '700' }}>{job.company}</div>
              <div style={{ fontSize: '0.825rem', color: '#9ca3af' }}>
                {job.employer?.email || 'Verified Employer'}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.6' }}>
            This employer is registered on JOBHUB. Applications submitted are routed directly to the employer's management dashboard.
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Apply for {job.title}</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {applyError && (
              <div className="alert alert-danger">
                <AlertCircle size={16} /> {applyError}
              </div>
            )}

            {applySuccess && (
              <div className="alert alert-success">
                <CheckCircle size={16} /> {applySuccess}
              </div>
            )}

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label>Resume Link / Summary Details *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://myresume.pdf or summary of qualifications..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cover Letter (Optional)</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Introduce yourself and explain why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  bannerCard: {
    padding: '2rem',
    marginBottom: '2rem'
  },
  headerTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  companyMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  companyIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  companyName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase'
  },
  jobTitle: {
    fontSize: '1.8rem',
    fontWeight: '800'
  },
  statsRow: {
    display: 'flex',
    gap: '2.5rem',
    marginTop: '1.75rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  statLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#9ca3af',
    textTransform: 'uppercase'
  },
  statVal: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#f3f4f6'
  },
  actionRow: {
    marginTop: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  contentCard: {
    padding: '2rem'
  },
  sidebarCard: {
    padding: '1.5rem'
  },
  sectionHeading: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.75rem'
  },
  bodyText: {
    color: '#d1d5db',
    lineHeight: '1.7',
    whiteSpace: 'pre-line'
  },
  skillsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.75rem'
  },
  companyIconSmall: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default JobDetails;

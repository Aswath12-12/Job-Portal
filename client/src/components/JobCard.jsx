import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Calendar, Building, ChevronRight, Edit3, Trash2, Users } from 'lucide-react';

const JobCard = ({ job, isEmployerOwner = false, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getJobTypeBadgeClass = (type) => {
    switch (type) {
      case 'Full Time':
        return 'badge-indigo';
      case 'Remote':
        return 'badge-cyan';
      case 'Internship':
        return 'badge-emerald';
      case 'Contract':
        return 'badge-warning';
      default:
        return 'badge-indigo';
    }
  };

  return (
    <div className="glass-card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.companyMeta}>
          <div style={styles.companyIcon}>
            <Building size={20} color="#6366f1" />
          </div>
          <div>
            <span style={styles.companyName}>{job.company}</span>
            <h3 style={styles.title}>{job.title}</h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className={`badge ${getJobTypeBadgeClass(job.jobType)}`}>
            {job.jobType}
          </span>
          <span className="badge badge-emerald">
            {job.category}
          </span>
          {job.status === 'closed' && (
            <span className="badge badge-danger">Closed</span>
          )}
        </div>
      </div>

      <div style={styles.detailsGrid}>
        <div style={styles.detailItem}>
          <MapPin size={15} color="#9ca3af" />
          <span>{job.location}</span>
        </div>
        <div style={styles.detailItem}>
          <DollarSign size={15} color="#10b981" />
          <span style={{ color: '#10b981', fontWeight: '600' }}>
            ${job.salaryMin ? job.salaryMin.toLocaleString() : '0'} - ${job.salaryMax ? job.salaryMax.toLocaleString() : '0'} / yr
          </span>
        </div>
        <div style={styles.detailItem}>
          <Calendar size={15} color="#9ca3af" />
          <span>Posted {formatDate(job.createdAt)}</span>
        </div>
      </div>

      {/* Skills Badges */}
      {job.skills && job.skills.length > 0 && (
        <div style={styles.skillsRow}>
          {job.skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} style={styles.skillTag}>
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span style={styles.skillMore}>+{job.skills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div style={styles.cardFooter}>
        <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
          View Details
          <ChevronRight size={16} />
        </Link>

        {isEmployerOwner && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/jobs/${job._id}/applications`} className="btn btn-outline btn-sm" title="Applications">
              <Users size={15} />
              <span>{job.applicationCount !== undefined ? job.applicationCount : 'Apps'}</span>
            </Link>
            <Link to={`/employer/jobs/edit/${job._id}`} className="btn btn-secondary btn-sm" title="Edit">
              <Edit3 size={15} color="#67e8f9" />
            </Link>
            <button
              onClick={() => onDelete && onDelete(job._id, job.title)}
              className="btn btn-danger btn-sm"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '1.4rem',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    gap: '1.2rem'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  companyMeta: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  companyIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.12)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  companyName: {
    fontSize: '0.825rem',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginTop: '0.15rem',
    lineHeight: '1.3'
  },
  detailsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#d1d5db'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  skillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem'
  },
  skillTag: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    padding: '0.2rem 0.5rem',
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  skillMore: {
    fontSize: '0.75rem',
    color: '#6b7280',
    alignSelf: 'center'
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
  }
};

export default JobCard;

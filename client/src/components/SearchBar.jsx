import React from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

const SearchBar = ({ searchParams, onSearchChange, onReset }) => {
  const categories = [
    'All',
    'Software Development',
    'Data Science',
    'UI/UX Design',
    'Marketing',
    'Finance',
    'Product Management',
    'DevOps',
    'Other'
  ];

  const jobTypes = ['All', 'Full Time', 'Part Time', 'Internship', 'Contract', 'Remote'];

  return (
    <div className="glass-card" style={styles.container}>
      <div style={styles.grid}>
        {/* Main Keywords Input */}
        <div style={styles.field}>
          <label style={styles.label}>
            <Search size={14} /> Search Keywords
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Job title, company, or skills..."
            value={searchParams.search || ''}
            onChange={(e) => onSearchChange('search', e.target.value)}
          />
        </div>

        {/* Location Input */}
        <div style={styles.field}>
          <label style={styles.label}>
            <MapPin size={14} /> Location
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="City, State or Remote..."
            value={searchParams.location || ''}
            onChange={(e) => onSearchChange('location', e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div style={styles.field}>
          <label style={styles.label}>
            <Filter size={14} /> Category
          </label>
          <select
            className="form-control"
            value={searchParams.category || 'All'}
            onChange={(e) => onSearchChange('category', e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type Dropdown */}
        <div style={styles.field}>
          <label style={styles.label}>Job Type</label>
          <select
            className="form-control"
            value={searchParams.jobType || 'All'}
            onChange={(e) => onSearchChange('jobType', e.target.value)}
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.footerRow}>
        <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
          Filter active listings in real-time
        </div>
        <button onClick={onReset} className="btn btn-secondary btn-sm">
          <RotateCcw size={14} /> Reset Filters
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem'
  },
  footerRow: {
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem'
  }
};

export default SearchBar;

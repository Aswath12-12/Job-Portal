import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import { Briefcase, SlidersHorizontal } from 'lucide-react';

const BrowseJobs = () => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchParams, setSearchParams] = useState({
    search: urlSearchParams.get('search') || '',
    location: urlSearchParams.get('location') || '',
    category: urlSearchParams.get('category') || 'All',
    jobType: urlSearchParams.get('jobType') || 'All'
  });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.search) params.search = searchParams.search;
      if (searchParams.location) params.location = searchParams.location;
      if (searchParams.category && searchParams.category !== 'All') params.category = searchParams.category;
      if (searchParams.jobType && searchParams.jobType !== 'All') params.jobType = searchParams.jobType;

      const res = await fetchJobs(params);
      setJobs(res.data.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [searchParams]);

  const handleSearchChange = (field, value) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setSearchParams({
      search: '',
      location: '',
      category: 'All',
      jobType: 'All'
    });
    setUrlSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={styles.pageHeader}>
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
            <Briefcase size={14} /> Public Access Page
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Browse Available Jobs</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Find your next role among verified engineering and technology job listings.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchBar
        searchParams={searchParams}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
      />

      {/* Results Header */}
      <div style={styles.resultsMeta}>
        <span style={{ fontWeight: '600', color: '#f3f4f6' }}>
          Showing {jobs.length} Job{jobs.length !== 1 ? 's' : ''}
        </span>
        {(searchParams.search || searchParams.location || searchParams.category !== 'All' || searchParams.jobType !== 'All') && (
          <span className="badge badge-cyan">Filtered Results</span>
        )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="spinner"></div>
      ) : jobs.length > 0 ? (
        <div className="grid-2">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyBox}>
          <SlidersHorizontal size={40} color="#6b7280" />
          <h3 style={{ marginTop: '1rem' }}>No Jobs Matched Your Criteria</h3>
          <p style={{ color: '#9ca3af', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Try adjusting your search terms or clearing selected filters to see more results.
          </p>
          <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ marginTop: '1.25rem' }}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageHeader: {
    marginBottom: '2rem'
  },
  resultsMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem'
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

export default BrowseJobs;

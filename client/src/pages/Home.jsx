import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import JobCard from '../components/JobCard';
import { Search, MapPin, Code2, Database, Palette, TrendingUp, DollarSign, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getFeatured = async () => {
      try {
        const res = await fetchJobs();
        setLatestJobs(res.data.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching jobs for home page:', err);
      } finally {
        setLoading(false);
      }
    };
    getFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`);
  };

  const categories = [
    { title: 'Software Development', icon: Code2, count: '120+ Jobs', color: '#6366f1' },
    { title: 'Data Science', icon: Database, count: '85+ Jobs', color: '#06b6d4' },
    { title: 'UI/UX Design', icon: Palette, count: '64+ Jobs', color: '#ec4899' },
    { title: 'Marketing', icon: TrendingUp, count: '45+ Jobs', color: '#f59e0b' },
    { title: 'Finance', icon: DollarSign, count: '50+ Jobs', color: '#10b981' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero Banner Section */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContainer}>
          <div className="badge badge-indigo" style={{ marginBottom: '1.25rem' }}>
            <Zap size={14} /> MERN MVC Stack Demonstration
          </div>

          <h1 style={styles.heroTitle}>
            Find Your Dream Job & <br />
            <span style={styles.gradientText}>Advance Your Tech Career</span>
          </h1>

          <p style={styles.heroSubtitle}>
            Connect with top technology companies or hire world-class talent with our secure MVC-driven job portal platform.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleHeroSearch} className="glass-card" style={styles.heroSearchBox}>
            <div style={styles.searchField}>
              <Search size={18} color="#9ca3af" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.heroInput}
              />
            </div>

            <div style={styles.searchDivider}></div>

            <div style={styles.searchField}>
              <MapPin size={18} color="#9ca3af" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, NY)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={styles.heroInput}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              Search Jobs
            </button>
          </form>

          {/* Quick Stats */}
          <div style={styles.heroStats}>
            <div>
              <span style={styles.statNum}>1,000+</span>
              <span style={styles.statLabel}>Active Job Listings</span>
            </div>
            <div style={styles.statDot}>•</div>
            <div>
              <span style={styles.statNum}>500+</span>
              <span style={styles.statLabel}>Verified Tech Employers</span>
            </div>
            <div style={styles.statDot}>•</div>
            <div>
              <span style={styles.statNum}>100%</span>
              <span style={styles.statLabel}>MVC Role Enforcement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="container">
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Popular Categories</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Explore high-demand engineering and tech fields</p>
          </div>
        </div>

        <div className="grid-5" style={styles.catGrid}>
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="glass-card"
                style={styles.catCard}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.title)}`)}
              >
                <div style={{ ...styles.catIcon, background: `${cat.color}20`, borderColor: `${cat.color}40` }}>
                  <Icon size={24} color={cat.color} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0.5rem 0 0.2rem 0' }}>{cat.title}</h4>
                <span style={{ fontSize: '0.825rem', color: '#9ca3af' }}>{cat.count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="container">
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Latest Jobs</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Publicly accessible job postings — No login required to browse</p>
          </div>

          <Link to="/jobs" className="btn btn-secondary">
            View All Jobs
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : latestJobs.length > 0 ? (
          <div className="grid-2">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
            No jobs found. Run the seed script to populate sample listings!
          </div>
        )}
      </section>

      {/* MVC Architecture Explanation Callout */}
      <section className="container">
        <div className="glass-card" style={styles.architectureBox}>
          <div style={{ flex: 1 }}>
            <div className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
              <ShieldCheck size={14} /> MVC Architecture Breakdown
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.75rem' }}>
              Separation of Public vs Protected Functionality
            </h3>
            <p style={{ color: '#9ca3af', lineHeight: '1.7', fontSize: '0.95rem' }}>
              In this MERN stack application, <strong>React Views</strong> display public job postings to any visitor, while Express <strong>Controllers</strong> enforce strict JWT authentication & role-based middleware. Job seekers can browse and apply, while employers securely post and manage their job postings in MongoDB.
            </p>
          </div>

          <div style={styles.archButtons}>
            <Link to="/register" className="btn btn-primary">
              Register Account
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Employer Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  heroSection: {
    padding: '4rem 0 2rem 0',
    textAlign: 'center',
    position: 'relative'
  },
  heroContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heroTitle: {
    fontSize: '3.2rem',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '1.25rem'
  },
  gradientText: {
    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '1.15rem',
    color: '#9ca3af',
    maxWidth: '680px',
    marginBottom: '2.5rem'
  },
  heroSearchBox: {
    padding: '0.6rem 0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '840px',
    borderRadius: '16px',
    flexWrap: 'wrap'
  },
  searchField: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    flex: 1,
    padding: '0.5rem 0.75rem',
    minWidth: '200px'
  },
  heroInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#ffffff',
    fontSize: '0.95rem',
    width: '100%'
  },
  searchDivider: {
    width: '1px',
    height: '32px',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  heroStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginTop: '2.5rem',
    fontSize: '0.9rem',
    color: '#9ca3af',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  statNum: {
    fontWeight: '800',
    color: '#ffffff',
    marginRight: '0.4rem'
  },
  statLabel: {
    color: '#9ca3af'
  },
  statDot: {
    color: 'rgba(255, 255, 255, 0.2)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '800'
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem'
  },
  catCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    cursor: 'pointer'
  },
  catIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem'
  },
  architectureBox: {
    padding: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    flexWrap: 'wrap',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.25)'
  },
  archButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJobById, updateJob } from '../services/api';
import { Edit3, ArrowLeft, AlertCircle } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'Full Time',
    category: 'Software Development',
    skills: '',
    description: '',
    requirements: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Software Development',
    'Data Science',
    'UI/UX Design',
    'Marketing',
    'Finance',
    'Product Management',
    'DevOps',
    'Other'
  ];

  const jobTypes = ['Full Time', 'Part Time', 'Internship', 'Contract', 'Remote'];

  useEffect(() => {
    const getJob = async () => {
      try {
        const res = await fetchJobById(id);
        const j = res.data.data;
        setFormData({
          title: j.title || '',
          company: j.company || '',
          location: j.location || '',
          salaryMin: j.salaryMin || '',
          salaryMax: j.salaryMax || '',
          jobType: j.jobType || 'Full Time',
          category: j.category || 'Software Development',
          skills: j.skills ? j.skills.join(', ') : '',
          description: j.description || '',
          requirements: j.requirements || '',
          status: j.status || 'active'
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job data');
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      return setError('Minimum salary cannot exceed maximum salary.');
    }

    setSubmitting(true);
    try {
      await updateJob(id, formData);
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job posting');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '820px' }}>
      <Link to="/employer/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Edit Job Posting</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Update your job information, salary details, or toggle job status.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company"
                className="form-control"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Job Category *</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Job Type *</label>
              <select
                name="jobType"
                className="form-control"
                value={formData.jobType}
                onChange={handleChange}
                required
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Job Status *</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="active">Active (Open)</option>
                <option value="closed">Closed (No new apps)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Skills Required *</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Minimum Salary ($ / Year) *</label>
              <input
                type="number"
                name="salaryMin"
                className="form-control"
                value={formData.salaryMin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Maximum Salary ($ / Year) *</label>
              <input
                type="number"
                name="salaryMax"
                className="form-control"
                value={formData.salaryMax}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Requirements & Qualifications *</label>
            <textarea
              name="requirements"
              className="form-control"
              rows="4"
              value={formData.requirements}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Link to="/employer/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              <Edit3 size={18} />
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;

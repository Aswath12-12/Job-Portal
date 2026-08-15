import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, ArrowLeft, AlertCircle, Briefcase } from 'lucide-react';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.companyName || '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'Full Time',
    category: 'Software Development',
    skills: '',
    description: '',
    requirements: ''
  });

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
      await createJob(formData);
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '820px' }}>
      <Link to="/employer/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
            <Briefcase size={14} /> Employer Only Action
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Post a New Job Opening</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Fill out the job specifications below to publish listing to candidates.
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
                placeholder="e.g. Senior MERN Developer"
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
                placeholder="e.g. TechCorp Solutions"
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
              <label>Location *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g. New York, NY or Remote"
                value={formData.location}
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
                placeholder="e.g. 80000"
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
                placeholder="e.g. 120000"
                value={formData.salaryMax}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Skills Required (Comma separated) *</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              placeholder="e.g. React, Node.js, Express, MongoDB, TypeScript"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="5"
              placeholder="Describe role responsibilities, team culture, and day-to-day expectations..."
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
              placeholder="List required years of experience, degrees, certifications, or specific technical tools..."
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
              <PlusCircle size={18} />
              {submitting ? 'Publishing Job...' : 'Publish Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;

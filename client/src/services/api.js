import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Interceptor to attach Authorization header with Bearer token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// Job Services
export const fetchJobs = (params) => API.get('/jobs', { params });
export const fetchJobById = (id) => API.get(`/jobs/${id}`);
export const fetchEmployerJobs = () => API.get('/jobs/employer/my-jobs');
export const createJob = (jobData) => API.post('/jobs', jobData);
export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Application Services
export const applyForJob = (applicationData) => API.post('/applications', applicationData);
export const fetchMyApplications = () => API.get('/applications/my');
export const fetchJobApplications = (jobId) => API.get(`/jobs/${jobId}/applications`);
export const updateApplicationStatus = (id, status) => API.put(`/applications/${id}/status`, { status });

// Admin Services
export const fetchAdminStats = () => API.get('/admin/stats');
export const fetchAllUsers = () => API.get('/admin/users');
export const fetchAllJobsAdmin = () => API.get('/admin/jobs');
export const deleteJobAdmin = (id) => API.delete(`/admin/jobs/${id}`);
export const fetchAllApplicationsAdmin = () => API.get('/admin/applications');

export default API;

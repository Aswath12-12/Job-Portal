import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import BrowseJobs from './pages/BrowseJobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerDashboard from './pages/EmployerDashboard';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import JobApplications from './pages/JobApplications';
import JobseekerDashboard from './pages/JobseekerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<BrowseJobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Employer Protected Routes */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs/create"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <CreateJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <EditJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id/applications"
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <JobApplications />
                  </ProtectedRoute>
                }
              />

              {/* Job Seeker Protected Routes */}
              <Route
                path="/jobseeker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <JobseekerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

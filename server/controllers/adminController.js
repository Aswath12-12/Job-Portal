import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Get system dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalJobseekers = await User.countDocuments({ role: 'jobseeker' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalEmployers,
        totalJobseekers,
        totalJobs,
        activeJobs,
        totalApplications
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all job postings
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('employer', 'name email companyName')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete any job posting
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
export const deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    return res.json({
      success: true,
      message: 'Job posting deleted by Admin successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all application submissions
// @route   GET /api/admin/applications
// @access  Private (Admin)
export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'name email')
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

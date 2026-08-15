import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker)
export const applyJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    if (!jobId || !resume) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job ID and resume details'
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    if (job.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is closed for applications'
      });
    }

    // Check for duplicate application requirement
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job posting.'
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume,
      coverLetter: coverLetter || '',
      status: 'Applied'
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job posting.'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current job seeker's applications
// @route   GET /api/applications/my
// @access  Private (Job Seeker)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title company location salaryMin salaryMax jobType category status'
      })
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

// @desc    Get applications for a specific job (Employer Owner / Admin)
// @route   GET /api/jobs/:id/applications
// @access  Private (Employer / Admin)
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Ownership check (if not admin)
    if (req.user.role !== 'admin' && job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have ownership of this job posting'
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email companyName')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: applications.length,
      jobTitle: job.title,
      data: applications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update application status (Employer / Admin)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer / Admin)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check ownership of the job associated with this application
    if (req.user.role !== 'admin' && application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own the job posting for this application'
      });
    }

    application.status = status;
    await application.save();

    return res.json({
      success: true,
      message: `Application status updated to '${status}'`,
      data: application
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

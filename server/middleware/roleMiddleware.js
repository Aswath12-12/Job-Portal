import Job from '../models/Job.js';

// Enforce specific user roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};

// Enforce that the requesting user owns the specific job (or is admin)
export const requireJobOwner = async (req, res, next) => {
  try {
    const jobId = req.params.id || req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Admin can override
    if (req.user.role === 'admin') {
      req.job = job;
      return next();
    }

    // Must be employer and must own the job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have ownership of this job posting'
      });
    }

    req.job = job;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

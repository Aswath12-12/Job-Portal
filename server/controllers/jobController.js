import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Get all jobs (with search and filters)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { search, category, jobType, location, salaryMin, salaryMax, status } = req.query;

    const query = {};

    // Only active jobs by default for public users unless requested
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    // Search by title, company, location, skills
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { skills: { $in: [searchRegex] } },
        { category: searchRegex }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by jobType
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    // Filter by location
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Filter by salary range
    if (salaryMin) {
      query.salaryMax = { $gte: Number(salaryMin) };
    }
    if (salaryMax) {
      query.salaryMin = { $lte: Number(salaryMax) };
    }

    const jobs = await Job.find(query)
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

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email companyName');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    return res.json({
      success: true,
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get jobs created by currently logged-in employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer)
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });

    // Also get application count per job
    const jobsWithAppCount = await Promise.all(
      jobs.map(async (job) => {
        const appCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicationCount: appCount
        };
      })
    );

    return res.json({
      success: true,
      count: jobsWithAppCount.length,
      data: jobsWithAppCount
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salaryMin,
      salaryMax,
      jobType,
      category,
      skills,
      requirements
    } = req.body;

    // Backend validation
    if (
      !title ||
      !description ||
      !location ||
      !salaryMin ||
      !salaryMax ||
      !jobType ||
      !category ||
      !requirements
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required job fields'
      });
    }

    if (Number(salaryMin) > Number(salaryMax)) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot be greater than maximum salary'
      });
    }

    // Process skills array
    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      description,
      company: company || req.user.companyName || req.user.name,
      location,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      jobType,
      category,
      skills: skillsArray,
      requirements,
      employer: req.user._id,
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Employer Owner / Admin)
export const updateJob = async (req, res) => {
  try {
    const job = req.job || (await Job.findById(req.params.id));

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const {
      title,
      description,
      company,
      location,
      salaryMin,
      salaryMax,
      jobType,
      category,
      skills,
      requirements,
      status
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (company) job.company = company;
    if (location) job.location = location;
    if (salaryMin !== undefined) job.salaryMin = Number(salaryMin);
    if (salaryMax !== undefined) job.salaryMax = Number(salaryMax);
    if (jobType) job.jobType = jobType;
    if (category) job.category = category;
    if (requirements) job.requirements = requirements;
    if (status) job.status = status;

    if (skills) {
      job.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : job.skills;
    }

    const updatedJob = await job.save();

    return res.json({
      success: true,
      message: 'Job posting updated successfully',
      data: updatedJob
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Employer Owner / Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = req.job || (await Job.findById(req.params.id));

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Also remove applications for this job
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    return res.json({
      success: true,
      message: 'Job and associated applications deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

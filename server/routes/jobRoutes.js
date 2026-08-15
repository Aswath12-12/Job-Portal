import express from 'express';
import {
  getJobs,
  getJobById,
  getEmployerJobs,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { getJobApplications } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole, requireJobOwner } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);

// Employer route for listing their own posted jobs (must be before /:id)
router.get('/employer/my-jobs', protect, requireRole('employer'), getEmployerJobs);

// Public route for single job details
router.get('/:id', getJobById);

// Employer restricted job creation
router.post('/', protect, requireRole('employer'), createJob);

// Employer owner or Admin job modifications
router.put('/:id', protect, requireRole('employer', 'admin'), requireJobOwner, updateJob);
router.delete('/:id', protect, requireRole('employer', 'admin'), requireJobOwner, deleteJob);

// Applications for a job (Employer owner or Admin)
router.get('/:id/applications', protect, requireRole('employer', 'admin'), requireJobOwner, getJobApplications);

export default router;

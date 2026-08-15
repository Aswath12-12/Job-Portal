import express from 'express';
import {
  applyJob,
  getMyApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Job Seeker routes
router.post('/', protect, requireRole('jobseeker'), applyJob);
router.get('/my', protect, requireRole('jobseeker'), getMyApplications);

// Employer / Admin update application status route
router.put('/:id/status', protect, requireRole('employer', 'admin'), updateApplicationStatus);

export default router;

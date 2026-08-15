import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllJobsAdmin,
  deleteJobAdmin,
  getAllApplicationsAdmin
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes strictly require authentication and Admin role
router.use(protect);
router.use(requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/jobs', getAllJobsAdmin);
router.delete('/jobs/:id', deleteJobAdmin);
router.get('/applications', getAllApplicationsAdmin);

export default router;

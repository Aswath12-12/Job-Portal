import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resume: {
      type: String,
      required: [true, 'Please provide resume link or summary']
    },
    coverLetter: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'],
      default: 'Applied'
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate applications by same user for same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;

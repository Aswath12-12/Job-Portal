import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a job description']
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please add a job location'],
      trim: true
    },
    salaryMin: {
      type: Number,
      required: [true, 'Please add minimum salary']
    },
    salaryMax: {
      type: Number,
      required: [true, 'Please add maximum salary']
    },
    jobType: {
      type: String,
      required: [true, 'Please select job type'],
      enum: ['Full Time', 'Part Time', 'Internship', 'Contract', 'Remote']
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      enum: [
        'Software Development',
        'Data Science',
        'UI/UX Design',
        'Marketing',
        'Finance',
        'Product Management',
        'DevOps',
        'Other'
      ]
    },
    skills: {
      type: [String],
      required: [true, 'Please specify skills needed']
    },
    requirements: {
      type: String,
      required: [true, 'Please specify requirements']
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;

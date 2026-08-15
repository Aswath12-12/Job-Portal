import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';

dotenv.config();

export const seedData = async (auto = false) => {
  try {
    if (!auto) {
      await connectDB();
    }

    const userCount = await User.countDocuments();
    if (auto && userCount > 0) {
      console.log(`Database already initialized with ${userCount} users. Skipping auto-seed.`);
      return;
    }

    // Clear existing data only if manually executed via npm run seed
    if (!auto) {
      await User.deleteMany();
      await Job.deleteMany();
      await Application.deleteMany();
      console.log('Cleared existing database entries...');
    }

    // 1. Create Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@jobportal.com',
      password: 'admin123',
      role: 'admin',
      companyName: 'JobPortal Headquarters'
    });

    const employer1 = await User.create({
      name: 'Tech Corp Hiring Manager',
      email: 'employer@tech.com',
      password: 'employer123',
      role: 'employer',
      companyName: 'TechCorp Solutions'
    });

    const employer2 = await User.create({
      name: 'Innovate AI Talent Team',
      email: 'hiring@innovate.io',
      password: 'employer123',
      role: 'employer',
      companyName: 'Innovate AI Labs'
    });

    const jobseeker1 = await User.create({
      name: 'Alex Johnson',
      email: 'student@example.com',
      password: 'student123',
      role: 'jobseeker',
      companyName: ''
    });

    const jobseeker2 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah.dev@example.com',
      password: 'student123',
      role: 'jobseeker',
      companyName: ''
    });

    console.log('Created Users: Admin, Employers, Job Seekers.');

    // 2. Create Sample Jobs (At least 8 realistic jobs)
    const jobsData = [
      {
        title: 'Senior Full Stack MERN Developer',
        company: 'TechCorp Solutions',
        location: 'New York, NY (Hybrid)',
        salaryMin: 120000,
        salaryMax: 155000,
        jobType: 'Full Time',
        category: 'Software Development',
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
        description:
          'We are looking for a Senior Full Stack Engineer to lead our enterprise Web platform modernizations. You will architect robust microservices in Node/Express and design reactive web applications with modern React.',
        requirements:
          '5+ years of experience with Javascript/TypeScript. Deep expertise in MERN stack architecture, state management, REST API design, and cloud deployments on AWS/Docker.',
        employer: employer1._id,
        status: 'active'
      },
      {
        title: 'Frontend React UI/UX Engineer',
        company: 'Innovate AI Labs',
        location: 'San Francisco, CA (Remote)',
        salaryMin: 100000,
        salaryMax: 130000,
        jobType: 'Remote',
        category: 'UI/UX Design',
        skills: ['React', 'Figma', 'CSS3', 'Framer Motion', 'Web Accessibility'],
        description:
          'Join our product design team to craft hyper-responsive, beautiful web interfaces. You will translate wireframes into pixel-perfect React components with dynamic transitions and animations.',
        requirements:
          'Strong frontend React background, eye for design, proficiency in CSS custom properties, responsive design patterns, and cross-browser performance tuning.',
        employer: employer2._id,
        status: 'active'
      },
      {
        title: 'Data Science & Machine Learning Engineer',
        company: 'Innovate AI Labs',
        location: 'Boston, MA',
        salaryMin: 135000,
        salaryMax: 170000,
        jobType: 'Full Time',
        category: 'Data Science',
        skills: ['Python', 'PyTorch', 'Pandas', 'Scikit-Learn', 'FastAPI'],
        description:
          'Build predictive AI models and NLP pipelines to automate data insights for enterprise clients. Work closely with software engineers to deploy ML models into production API endpoints.',
        requirements:
          'B.S. or M.S. in Computer Science or Data Science. 3+ years experience with Python AI ecosystem, model evaluation, and MLOps pipelines.',
        employer: employer2._id,
        status: 'active'
      },
      {
        title: 'DevOps & Cloud Infrastructure Specialist',
        company: 'TechCorp Solutions',
        location: 'Austin, TX',
        salaryMin: 115000,
        salaryMax: 145000,
        jobType: 'Full Time',
        category: 'DevOps',
        skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
        description:
          'Oversee cloud infrastructure resiliency and CI/CD automation workflows. Maintain high availability across AWS ECS, Kubernetes clusters, and automated staging pipelines.',
        requirements:
          'Hands-on experience with AWS cloud services, Docker containerization, GitHub Actions, infrastructure as code using Terraform, and monitoring with Prometheus/Grafana.',
        employer: employer1._id,
        status: 'active'
      },
      {
        title: 'Technical Product Manager',
        company: 'Innovate AI Labs',
        location: 'Chicago, IL (Hybrid)',
        salaryMin: 110000,
        salaryMax: 140000,
        jobType: 'Full Time',
        category: 'Product Management',
        skills: ['Agile', 'Jira', 'Product Strategy', 'User Analytics', 'API Specs'],
        description:
          'Define the product roadmap for our SaaS platform. Work with engineering and UI designers to prioritize backlog features and drive product market fit.',
        requirements:
          '3+ years technical product management experience in B2B SaaS. Strong communication, analytical thinking, and wireframing skills.',
        employer: employer2._id,
        status: 'active'
      },
      {
        title: 'Digital Marketing & Growth Lead',
        company: 'TechCorp Solutions',
        location: 'Remote',
        salaryMin: 85000,
        salaryMax: 110000,
        jobType: 'Contract',
        category: 'Marketing',
        skills: ['SEO', 'Google Analytics', 'Content Marketing', 'HubSpot'],
        description:
          'Lead developer acquisition and B2B growth marketing strategies across digital channels. Optimize conversion funnels and launch target ad campaigns.',
        requirements:
          'Proven track record scaling growth metrics for tech platforms. Deep experience with SEO audits, analytics software, and content strategy.',
        employer: employer1._id,
        status: 'active'
      },
      {
        title: 'Financial Analyst & Fintech Consultant',
        company: 'TechCorp Solutions',
        location: 'New York, NY',
        salaryMin: 95000,
        salaryMax: 125000,
        jobType: 'Full Time',
        category: 'Finance',
        skills: ['Financial Modeling', 'Excel', 'SQL', 'Tableau'],
        description:
          'Analyze revenue metrics, generate quarterly financial forecasts, and optimize cash flow models for our enterprise client portfolio.',
        requirements:
          'Degree in Finance or Economics. Advanced SQL and Excel financial modeling skills. CFA certification preferred.',
        employer: employer1._id,
        status: 'active'
      },
      {
        title: 'Junior React Frontend Intern',
        company: 'TechCorp Solutions',
        location: 'Remote',
        salaryMin: 45000,
        salaryMax: 60000,
        jobType: 'Internship',
        category: 'Software Development',
        skills: ['React', 'JavaScript', 'HTML5/CSS3', 'Git'],
        description:
          'An exciting internship opportunity for entry-level developers! Work alongside senior React developers to fix bug tickets, write unit tests, and build reusable UI components.',
        requirements:
          'Solid understanding of JavaScript ES6 concepts, React functional components, Git version control, and passion for web development.',
        employer: employer1._id,
        status: 'active'
      }
    ];

    const createdJobs = await Job.insertMany(jobsData);
    console.log(`Created ${createdJobs.length} Job Postings.`);

    // 3. Create Sample Applications
    await Application.create({
      job: createdJobs[0]._id, // MERN Developer job
      applicant: jobseeker1._id,
      resume: 'https://alexjohnson-dev.portfolio/resume.pdf - Alex Johnson Resume (3 Yrs React/Node experience)',
      coverLetter:
        'Dear Hiring Manager, I am extremely thrilled to apply for the Senior MERN Developer role. I have built multiple full stack applications with React, Express, Node, and MongoDB.',
      status: 'Under Review'
    });

    await Application.create({
      job: createdJobs[1]._id, // Frontend React job
      applicant: jobseeker1._id,
      resume: 'https://alexjohnson-dev.portfolio/resume.pdf - Alex Johnson Resume',
      coverLetter:
        'I love creating clean user interfaces with React and modern CSS. I look forward to contributing to Innovate AI Labs!',
      status: 'Applied'
    });

    await Application.create({
      job: createdJobs[2]._id, // Data Science job
      applicant: jobseeker2._id,
      resume: 'https://sarahchen-ai.dev/resume.pdf - Sarah Chen ML Engineer Resume',
      coverLetter:
        'With a M.S. in Computer Science and PyTorch expertise, I am eager to help build state of the art ML models.',
      status: 'Shortlisted'
    });

    console.log('Created sample applications.');
    console.log('\n==========================================');
    console.log('   DEMO ACCOUNTS FOR LOCAL TESTING:');
    console.log('==========================================');
    console.log('1. ADMIN ACCOUNT:');
    console.log('   Email:    admin@jobportal.com');
    console.log('   Password: admin123');
    console.log('------------------------------------------');
    console.log('2. EMPLOYER ACCOUNT:');
    console.log('   Email:    employer@tech.com');
    console.log('   Password: employer123');
    console.log('------------------------------------------');
    console.log('3. JOB SEEKER ACCOUNT:');
    console.log('   Email:    student@example.com');
    console.log('   Password: student123');
    console.log('==========================================\n');

    if (!auto) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`Error with data seed: ${error.message}`);
    if (!auto) {
      process.exit(1);
    }
  }
};

// If file is run directly via node seed.js
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('seed.js')) {
  seedData();
}


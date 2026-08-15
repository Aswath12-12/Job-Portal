========================================================================
             MERN MVC JOB PORTAL - HOW TO RUN INSTRUCTIONS
========================================================================

PREREQUISITES:
--------------
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- MongoDB (Optional: Local MongoDB on port 27017 or MongoDB Atlas URI.
  If MongoDB is not installed or running, the server will automatically 
  fall back to an Embedded In-Memory MongoDB Database!).


------------------------------------------------------------------------
STEP 1: INSTALL ALL DEPENDENCIES
------------------------------------------------------------------------
Open a terminal in the project root directory (d:\Projects\job) and run:

    npm run install-all

(Or manually run npm install in both server and client folders).


------------------------------------------------------------------------
STEP 2: SEED DEMO DATA (RECOMMENDED)
------------------------------------------------------------------------
To populate the database with sample jobs, users, and applications:

From the root directory:
    npm run seed


------------------------------------------------------------------------
STEP 3: RUN THE APPLICATION (BOTH FRONTEND & BACKEND)
------------------------------------------------------------------------
You can run both Frontend and Backend concurrently with a single command:

From the root directory:
    npm run dev

This will start:
  - Backend Server:  http://localhost:5000
  - Frontend Client:  http://localhost:5173

Open your browser and navigate to: http://localhost:5173


------------------------------------------------------------------------
ALTERNATIVE: RUN FRONTEND AND BACKEND SEPARATELY
------------------------------------------------------------------------
If you prefer running in separate terminal windows:

Terminal 1 (Backend Server):
    cd server
    npm run dev

Terminal 2 (Frontend Client):
    cd client
    npm run dev


------------------------------------------------------------------------
DEMO LOGIN CREDENTIALS
------------------------------------------------------------------------
After seeding the database, you can log in with these accounts:

1. ADMIN ACCOUNT:
   Email:    admin@jobportal.com
   Password: admin123
   Role:     System Admin (Full system control & user management)

2. EMPLOYER ACCOUNT:
   Email:    employer@tech.com
   Password: employer123
   Role:     Employer (Post jobs, manage listings, view applicants)

3. JOB SEEKER ACCOUNT:
   Email:    student@example.com
   Password: student123
   Role:     Job Seeker (Browse/search jobs, submit applications)


------------------------------------------------------------------------
PROJECT STRUCTURE OVERVIEW
------------------------------------------------------------------------
├── client/              # React (Vite) Frontend
│   ├── src/             # Components, Pages, Context, API hooks
│   └── package.json
├── server/              # Node.js + Express Backend (MVC Architecture)
│   ├── config/          # Database configuration
│   ├── controllers/     # Controller logic (Auth, Jobs, Applications)
│   ├── models/          # Mongoose Models (User, Job, Application)
│   ├── routes/          # Express Routes
│   ├── seed.js          # Database Seeder
│   └── server.js        # Entry point
└── package.json         # Root scripts (concurrently runner)

========================================================================

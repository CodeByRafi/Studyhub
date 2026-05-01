# 🚀 StudyHub - Quick Start Guide

## 5-Minute Setup

### Step 1: Start Backend (Terminal 1)
```bash
cd server
npm run dev
```
You should see: `✅ Server running on port 5001`

### Step 2: Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```
You should see: `✅ Ready in X seconds`

### Step 3: Open Browser
```
Go to: http://localhost:3000
```

---

## Test the Platform

### 1️⃣ Create Account
- Click "Sign Up" (top right)
- Enter name, email, password
- Submit
- Redirects to Login

### 2️⃣ Login
- Use your email and password
- Click Login
- **You're now in Dashboard!** 👋

### 3️⃣ Explore Study
- Click **Study** in navbar
- Departments dropdown loads automatically
- Try uploading a PDF note (you should see the form)
- Upload any PDF file as a test
- See it appear in the notes list

### 4️⃣ Explore Research
- Click **Research** in navbar
- Same as Study - can browse and upload research papers

### 5️⃣ Explore Jobs
- Click **Jobs** in navbar
- Browse jobs (may be empty if no one has posted yet)
- Post a test job if logged in
- Apply for job - button changes to "✓ Applied"
- See applied jobs tracked

### 6️⃣ Try Comments & Ratings
- Go to Study and click on any note card
- See note details page
- Scroll down to add comment and rating (if logged in)
- Comment appears immediately

### 7️⃣ Logout
- See Logout button in Navbar (top right)
- Click to logout
- Redirects to homepage

---

## Common Next Steps

### See Real Data
To see actual data in the system instead of empty states:
1. Create 2-3 test accounts
2. Upload notes, research, and create jobs
3. Apply for jobs
4. Add comments and ratings
5. Watch stats update on dashboard

### Production Deployment
When ready to deploy:

1. Update `JWT_SECRET` in `server/.env`
2. Change `NEXT_PUBLIC_API_URL` to production domain
3. Update CORS in backend for production domain
4. Build frontend: `cd client && npm run build`
5. Deploy to your hosting service

### Database Backups
PostgreSQL data is stored in your local machine:
- Database: `/var/lib/postgresql/` (Linux) or default Windows location
- Uploads: `server/uploads/` folder
- Backup regularly before deployments

---

## What Works

### ✅ Fully Implemented Features

**Authentication**
- Email/password signup ✅
- Secure login with JWT ✅
- Token stored in browser ✅
- Logout clears everything ✅

**Dashboard**
- Protected by login ✅
- Shows real statistics ✅
- User welcome message ✅

**Study Notes**
- Browse by department/course ✅
- Upload PDF notes ✅
- Download notes ✅
- Add comments ✅
- Rate notes (1-5 stars) ✅

**Research Papers**
- Same features as Study ✅
- Post and browse research ✅

**Jobs**
- Browse job listings ✅
- Filter by type ✅
- Create job postings ✅
- Apply for jobs ✅
- Track applications ✅

**Visit Tracking**
- Every page visit recorded ✅
- Stats updated in real-time ✅

---

## Troubleshooting 101

### `Connection refused` error?
**Solution**: Make sure both backend and frontend are running
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm run dev
```

### Frontend shows blank page?
**Solution**: 
- Check browser console for errors (F12)
- Clear browser cache
- Restart frontend: `Ctrl+C` then `npm run dev`

### Can't upload file?
**Solution**:
- File must be PDF format
- File must be under 50MB
- Must be logged in
- Course must be selected

### Dashboard stats not updating?
**Solution**:
- Refresh page (F5)
- Stats update when page is visited
- Check `/api/stats` endpoint: `curl http://localhost:5001/api/stats`

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
│         Port 3000                       │
│  ┌─────────────────────────────────┐   │
│  │ Pages: Home, Auth, Dashboard    │   │
│  │ Study, Research, Jobs           │   │
│  │ Detail pages [id]               │   │
│  └─────────────────────────────────┘   │
└────────────┬──────────────────────────┘
             │ HTTP Requests (REST API)
             │
┌────────────▼──────────────────────────┐
│         Backend (Node.js/Express)     │
│         Port 5001                     │
│  ┌─────────────────────────────────┐  │
│  │ /api/auth (login, signup)       │  │
│  │ /api/study (notes, comments)    │  │
│  │ /api/research (papers)          │  │
│  │ /api/jobs (postings, apply)     │  │
│  │ /api/stats (dashboard)          │  │
│  └─────────────────────────────────┘  │
└────────────┬──────────────────────────┘
             │ SQL Queries
             │
┌────────────▼──────────────────────────┐
│    PostgreSQL Database                │
│    localhost:5432                     │
│    Database: studyhub                 │
└───────────────────────────────────────┘
```

---

## File Structure

```
studyhub/
├── client/                 # Frontend
│   ├── src/
│   │   ├── app/           # All pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── login/            # Login page
│   │   │   ├── signup/           # Signup page
│   │   │   ├── dashboard/        # Dashboard (protected)
│   │   │   ├── study/            # Study listing & detail
│   │   │   ├── research/         # Research listing & detail
│   │   │   └── jobs/             # Jobs listing
│   │   ├── components/           # React components
│   │   ├── services/            # API services
│   │   └── lib/                 # Utilities (auth.ts)
│   ├── .env.local           # Frontend config
│   └── package.json
│
├── server/                  # Backend
│   ├── modules/            # Business logic
│   ├── middleware/         # Auth, CORS, validation
│   ├── db/                 # Database setup
│   ├── config/             # Configuration
│   ├── uploads/            # Uploaded files
│   ├── .env                # Backend config
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md               # Project overview
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Study
- `GET /api/study/departments` - Get all departments
- `GET /api/study/courses?department_id=X` - Get courses
- `GET /api/study/notes?course_id=X` - Get notes
- `POST /api/study/notes/upload` - Upload note
- `POST /api/study/comments` - Add comment
- `POST /api/study/ratings` - Add rating

### Research
- `GET /api/research` - Get all research
- `POST /api/research/upload` - Upload research
- `POST /api/research/comments` - Add comment
- `POST /api/research/ratings` - Add rating

### Jobs
- `GET /api/jobs?type=X` - Get jobs (filter by type)
- `POST /api/jobs` - Create job
- `POST /api/jobs/apply` - Apply for job

### Utilities
- `POST /api/visit` - Track page visit
- `GET /api/stats` - Get dashboard statistics
- `GET /health` - Health check

---

## Need Help?

1. **Check backend logs** - See `server` terminal for errors
2. **Check frontend logs** - See `client` terminal for build errors
3. **Browser console** - Press F12 to see frontend errors
4. **API Testing** - Use curl or Postman to test endpoints
5. **Database** - Check PostgreSQL connection with `psql` CLI

---

## You're All Set! 🎉

Everything is integrated and ready to use. Start both servers and begin exploring StudyHub!

**Questions?** Check the full documentation files:
- `INTEGRATION_VERIFIED.md` - Verification checklist
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_STATUS.md` - Architecture details

Enjoy! 🚀

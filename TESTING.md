# StudyHub - Quick Start Testing Guide

## Start the Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
✅ Backend runs on: http://localhost:5001

### Terminal 2 - Frontend  
```bash
cd client
npm run dev
```
✅ Frontend runs on: http://localhost:3000

---

## Test Scenarios

### 1. Authentication Test

#### Sign Up
1. Go to http://localhost:3000/signup
2. Fill in:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Password: "Test123456"
   - Confirm: "Test123456"
3. Click "Create Account"
4. ✅ Should see "Signup successful! Redirecting to login..."
5. ✅ Automatically redirects to login page

#### Login
1. Go to http://localhost:3000/login
2. Fill in:
   - Email: "john@example.com"
   - Password: "Test123456"
3. Click "Login"
4. ✅ Should redirect to dashboard
5. ✅ Token saved in: `localStorage.getItem('token')`
6. ✅ User info saved in: `localStorage.getItem('user')`

---

### 2. Dashboard Test

#### Dashboard Page
1. After login, you're on http://localhost:3000/dashboard
2. ✅ See welcome message with your first name
3. ✅ See stats cards:
   - Total Users (should be 3+)
   - Total Visits (should increment)
   - Total Notes (0 initially)
   - Research Papers (0 initially)
4. ✅ See Quick Links section
5. ✅ See Your Profile section with name, email, member since

#### Expected Stats
```json
{
  "success": true,
  "data": {
    "totalUsers": 3,        // Existing users
    "totalVisits": 0,       // Increments when loading pages
    "totalNotes": 0,        // Increments when uploading notes
    "totalResearchPapers": 0  // Increments when uploading research
  }
}
```

---

### 3. Study Materials Test

#### Departments & Courses
1. Go to http://localhost:3000/study
2. In "Upload Notes" section:
   - Select Department dropdown
   - ❌ **Expected**: No departments (database is empty)
   - ✅ This is normal - seed data needed

#### Upload Notes (Once courses exist)
1. Select a department
2. Select a course
3. Enter note title: "Database fundamentals"
4. Select a PDF file
5. Click "Upload Note"
6. ✅ Should see success message
7. ✅ Note appears in the list below

#### Note Features
- Title display
- Author name (your first/last name)
- Average rating (⭐)
- Comment count (💬)
- ⬇️ Download button (downloads PDF)

---

### 4. Research Papers Test

#### Upload Paper
1. Go to http://localhost:3000/research
2. Fill in:
   - Paper Title: "Machine Learning Basics"
   - File: Select PDF
   - Abstract: "An introduction to ML concepts"
3. Click "Upload Paper"
4. ✅ Paper appears in list

#### Paper Features
- Title display
- Author name
- Abstract preview (truncated)
- Average rating
- Comment count
- ⬇️ Download button

---

### 5. Jobs Test

#### View Jobs
1. Go to http://localhost:3000/jobs
2. Tabs visible: All Jobs, Internships, Tuition, Part-time
3. ❌ **Expected**: No jobs initially
4. ✅ This is normal

#### Create Job (if logged in)
1. Click "Post Job" button
2. Fill in:
   - Job Title: "Frontend Developer"
   - Company: "TechCorp"
   - Type: "Internship"
   - Location: "Remote"
   - Salary: "$15-20/hr"
   - Email: "jobs@techcorp.com"
   - Description: "Build amazing features"
   - Requirements: "React, TypeScript"
3. Click "Post Job"
4. ✅ Job appears in list

#### Apply for Job
1. Click "Apply Now" button
2. ✅ Button changes to "✓ Applied"
3. ✅ Cannot apply twice

---

### 6. Analytics Test

#### Visit Tracking
1. Every page load records a visit
2. Dashboard shows total visits
3. Each page:
   - ✅ /dashboard records "dashboard"
   - ✅ /study records "study"
   - ✅ /research records "research"
   - ✅ /jobs records "jobs"
4. Visit count increments on dashboard

#### Test Visit Increment
```bash
# Check stats before
curl http://localhost:5001/api/stats

# Load a page in browser
# Check stats after - visitCount should increase
curl http://localhost:5001/api/stats
```

---

### 7. Error Handling Test

#### Login with Wrong Password
1. Go to login
2. Enter correct email, wrong password
3. Click "Login"
4. ✅ Red error box appears: "Invalid credentials..."

#### Upload Without Login
1. Clear localStorage: `localStorage.clear()`
2. Go to /study
3. Try to upload
4. ✅ Error message: "Please login to upload notes"

#### Upload Without Selecting Course
1. Go to /study
2. Enter title, select file, but NO course
3. Click Upload
4. ✅ Error message: "Please fill all required fields"

#### Network Error Simulation
1. Stop backend server
2. Try to login
3. ✅ Error message: "Unable to reach server..."

---

### 8. Token & Authorization Test

#### Token in Headers
1. Login successfully
2. Open browser DevTools (F12)
3. Go to Network tab
4. Perform an action (upload, apply, etc.)
5. Find the request in Network tab
6. ✅ Authorization header: `Bearer eyJhbG...`

#### Token in localStorage
1. Login successfully
2. Open browser DevTools (F12)
3. Go to Application → LocalStorage
4. ✅ See:
   - `token`: JWT token
   - `user`: `{id, email, first_name, last_name}`
   - `rememberEmail`: (if "Remember me" checked)

---

## API Testing with curl

### Test Auth Signup
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Test Auth Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Test Get Stats
```bash
curl http://localhost:5001/api/stats
```

### Test Record Visit
```bash
curl -X POST http://localhost:5001/api/visit \
  -H "Content-Type: application/json" \
  -d '{"page": "dashboard"}'
```

### Test Get Research (No Auth Required)
```bash
curl http://localhost:5001/api/research
```

### Test Upload Note (Requires Auth)
```bash
curl -X POST http://localhost:5001/api/study/notes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My Note" \
  -F "course_id=1" \
  -F "file=@path/to/file.pdf"
```

---

## Database Seeding (Optional)

To test with real data, you can manually insert data:

```sql
-- Connect to database
psql -U postgres -d studyhub

-- Add a department
INSERT INTO departments (name, description) 
VALUES ('Computer Science', 'CS courses');

-- Add a course
INSERT INTO courses (name, description, department_id, code, credits)
VALUES ('Database Systems', 'Learn databases', 1, 'CS101', 3);

-- Get the IDs
SELECT id, name FROM departments;
SELECT id, name FROM courses;
```

Then use these IDs when uploading notes and research papers.

---

## Troubleshooting

### Issue: "Cannot GET /api/xxx"
- **Cause**: Backend not running or route not registered
- **Fix**: Check backend console, restart with `npm run dev`

### Issue: "CORS error"
- **Cause**: Frontend and backend on different origins
- **Fix**: Check NEXT_PUBLIC_API_URL in .env.local matches backend URL

### Issue: Database connection failed
- **Cause**: PostgreSQL not running or credentials wrong
- **Fix**: 
  ```bash
  # Check credentials in .env
  # Restart PostgreSQL
  # Run setup-db.js again
  node setup-db.js
  ```

### Issue: Blank page or infinite loading
- **Cause**: Protected route issue
- **Fix**: Clear localStorage and login again

### Issue: Upload not working
- **Cause**: Missing /uploads directory or permission issue
- **Fix**: 
  ```bash
  cd server
  mkdir -p uploads
  chmod 755 uploads
  ```

---

## Success Indicators ✅

- [x] Backend server starts without errors
- [x] Frontend server starts without errors
- [x] `/health` endpoint returns 200
- [x] Can sign up with email
- [x] Can login with credentials
- [x] Token saved in localStorage
- [x] Dashboard shows stats
- [x] Can navigate between pages
- [x] Visit count increments
- [x] Error messages display properly
- [x] All buttons functional

**Everything should be working! 🎉**

If any issue occurs, check the browser console (F12) and backend terminal for error messages.

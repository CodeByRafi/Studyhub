# StudyHub Database Deployment & Verification Checklist

## PRE-DEPLOYMENT CHECKLIST

### System Requirements
- [ ] PostgreSQL 12+ installed (`psql --version`)
- [ ] PostgreSQL server running (`psql -U postgres` works)
- [ ] Node.js and npm installed (`node -v`, `npm -v`)
- [ ] At least 100MB free disk space
- [ ] Network access (localhost) available

### Project Setup
- [ ] Code is in: `c:\Users\rakib\OneDrive\Desktop\studyhub\`
- [ ] Backend is in: `c:\Users\rakib\OneDrive\Desktop\studyhub\server\`
- [ ] Schema file exists: `server\db\schema.sql` ✅
- [ ] Setup script exists: `server\setup-db.js` ✅
- [ ] Package.json has `setup-db` script ✅
- [ ] .env file exists: `server\.env`
- [ ] .env has correct contents (see below)

### Environment Configuration
Verify `.env` file has:
```
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123rafi1
DB_NAME=studyhub
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

- [ ] `DB_HOST=localhost`
- [ ] `DB_PORT=5432`
- [ ] `DB_USER` is correct
- [ ] `DB_PASSWORD` is correct (must match PostgreSQL user password)
- [ ] `DB_NAME=studyhub`

---

## DEPLOYMENT STEPS

### Step 1: Install Dependencies
```bash
cd server
npm install
```
- [ ] Dependencies installed successfully
- [ ] No errors during npm install
- [ ] `node_modules` folder created

### Step 2: Create Database and Tables
```bash
npm run setup-db
```
**Expected Output:**
```
🔄 Checking if database exists...
✅ Database "studyhub" already exists! (or created if new)
🔄 Running schema...
✅ Schema created successfully!

✅ Database setup complete!
📍 Run "npm run dev" to start the server
```

**Action Items:**
- [ ] Command completed without errors
- [ ] No database access denied errors
- [ ] No SQL syntax errors
- [ ] See "✅ Schema created successfully!" message

### Step 3: Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
Server is running on port 5001
Database connection: Connected
```

**Action Items:**
- [ ] Server starts without crashing
- [ ] No "EADDRINUSE" port already in use errors
- [ ] No "database does not exist" errors
- [ ] No connection timeout errors

---

## POST-DEPLOYMENT VERIFICATION

### Test 1: Database Connection
```bash
# In a new terminal, while server is running
curl http://localhost:5001/test-db
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "time": "2026-04-07T12:00:00.000Z"
}
```

- [ ] Request returns HTTP 200
- [ ] Response has `"success": true`
- [ ] Message says "Database connection successful"
- [ ] Time is returned

### Test 2: Server Health
```bash
curl http://localhost:5001/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-04-07T12:00:00.000Z",
  "version": "1.0.0"
}
```

- [ ] Request returns HTTP 200
- [ ] Response has `"success": true`
- [ ] Message says "Server is healthy"

### Test 3: Database Tables Exist
```bash
# In PostgreSQL client
psql -U postgres -d studyhub -c "\dt"
```

**Expected Output:**
```
                    List of relations
 Schema |          Name          | Type  |  Owner
--------+------------------------+-------+----------
 public | blog_posts             | table | postgres
 public | comments               | table | postgres
 public | courses                | table | postgres
 public | departments            | table | postgres
 public | job_applications       | table | postgres
 public | jobs                   | table | postgres
 public | question_comments      | table | postgres
 public | question_ratings       | table | postgres
 public | questions              | table | postgres
 public | ratings                | table | postgres
 public | research               | table | postgres
 public | research_comments      | table | postgres
 public | research_ratings       | table | postgres
 public | users                  | table | postgres
 public | visits                 | table | postgres
 (15 rows)
```

- [ ] All 15 tables are listed
- [ ] No missing tables

### Test 4: Table Structures
```bash
# Check users table
psql -U postgres -d studyhub -c "\d users"

# Check notes table
psql -U postgres -d studyhub -c "\d notes"

# Check all tables with columns
psql -U postgres -d studyhub -c "\d+"
```

**Actions:**
- [ ] Users table has: id, email, password, first_name, last_name, created_at, updated_at
- [ ] Notes table has: id, title, content, file_url, user_id, course_id, created_at, updated_at
- [ ] All foreign keys are shown
- [ ] All indexes are shown

### Test 5: Verify Indexes
```bash
psql -U postgres -d studyhub -c "SELECT * FROM pg_indexes WHERE schemaname = 'public';"
```

**Expected Indexes:**
- [ ] idx_users_email
- [ ] idx_notes_user_id
- [ ] idx_notes_course_id
- [ ] idx_comments_user_id
- [ ] idx_comments_note_id
- [ ] idx_ratings_user_id
- [ ] idx_ratings_note_id
- [ ] idx_questions_user_id
- [ ] idx_questions_course_id
- [ ] idx_question_comments_user_id
- [ ] idx_question_comments_question_id
- [ ] idx_question_ratings_user_id
- [ ] idx_question_ratings_question_id
- [ ] idx_research_user_id
- [ ] idx_research_comments_user_id
- [ ] idx_research_comments_research_id

**Count:** 15 indexes minimum

### Test 6: Data Integrity
```bash
# Check foreign key constraints
psql -U postgres -d studyhub -c "SELECT CONSTRAINT_NAME, TABLE_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = 'FOREIGN KEY' AND TABLE_SCHEMA = 'public';"
```

**Expected Foreign Keys:**
- [ ] notes_user_id_fkey
- [ ] notes_course_id_fkey
- [ ] comments_user_id_fkey
- [ ] comments_note_id_fkey
- [ ] ratings_user_id_fkey
- [ ] ratings_note_id_fkey
- [ ] And 10+ more for questions, research, jobs

---

## TROUBLESHOOTING

### Problem: "psql: command not found"
**Solution:** PostgreSQL is not in PATH
```bash
# Windows: Add PostgreSQL to PATH manually
# Or use full path: C:\Program Files\PostgreSQL\16\bin\psql
```

### Problem: "role 'postgres' does not exist"
**Solution:** PostgreSQL user not created
```bash
# Reinstall PostgreSQL or create user in pgAdmin
```

### Problem: "permission denied" or "FATAL: Ident authentication failed"
**Solution:** Password is wrong or user doesn't exist
```bash
# Check .env DB_PASSWORD matches PostgreSQL password
# Reset in PostgreSQL:
# ALTER USER postgres WITH PASSWORD 'your_password';
```

### Problem: "database 'studyhub' does not exist"
**Solution:** setup-db.js hasn't been run
```bash
npm run setup-db
```

### Problem: "EADDRINUSE: address already in use :::5001"
**Solution:** Port 5001 is already in use
```bash
# Change PORT in .env to 5002 or kill process on 5001
```

### Problem: "timeout expired"
**Solution:** PostgreSQL server is not running
```bash
# Windows: Start PostgreSQL service
# Linux: sudo systemctl start postgresql
# Mac: brew services start postgresql
```

---

## VERIFICATION MATRIX

| Component | Status | Notes |
|-----------|--------|-------|
| PostgreSQL installed | ✅ Required | Version 12+ |
| .env configured | ✅ Required | DB credentials |
| Dependencies installed | ✅ Required | `npm install` ran |
| Database created | ✅ Required | `npm run setup-db` ran |
| Schema applied | ✅ Required | All 15 tables exist |
| Indexes created | ✅ Required | 15+ indexes exist |
| Foreign keys defined | ✅ Required | Referential integrity |
| Server starts | ✅ Required | `npm run dev` works |
| /test-db responds | ✅ Required | Connection test passes |
| /health responds | ✅ Required | Health check passes |

---

## COMMON ISSUES & SOLUTIONS

| Issue | Cause | Solution |
|-------|-------|----------|
| Table not found | Schema not applied | Run `npm run setup-db` |
| Connection refused | PostgreSQL not running | Start PostgreSQL service |
| Permission denied | Wrong password | Check .env DB_PASSWORD |
| Port already in use | Another server on 5001 | Change PORT in .env or kill other process |
| Foreign key error | Record doesn't exist | Ensure referenced record exists before insert |
| Duplicate key error | Unique constraint violated | Check for duplicate ratings/applications |

---

## POST-DEPLOYMENT CONFIGURATION

### 1. Seed Initial Data (Optional)
```bash
# Create departments, courses for testing
psql -U postgres -d studyhub << EOF
INSERT INTO departments (name, description) VALUES ('Computer Science', 'CS Department');
INSERT INTO departments (name, description) VALUES ('Mathematics', 'Math Department');

INSERT INTO courses (name, code, department_id, credits) 
VALUES ('Data Structures', 'CS201', 1, 3);
INSERT INTO courses (name, code, department_id, credits) 
VALUES ('Calculus I', 'MATH101', 2, 4);
EOF
```

- [ ] Department seeding complete (optional)
- [ ] Courses seeding complete (optional)

### 2. Enable Backups
```bash
# Daily backup to backup folder
# Schedule: Daily at 2 AM
# Command: pg_dump -U postgres studyhub > backup_$(date +%Y%m%d).sql
```

- [ ] Backup strategy decided
- [ ] Backup location identified
- [ ] Backup frequency set

### 3. Monitor Performance
```bash
# Monitor queries taking > 1 second
psql -U postgres -d studyhub -c "ALTER DATABASE studyhub SET log_min_duration_statement = 1000;"
```

- [ ] Query logging enabled (optional)
- [ ] Log location identified

---

## FINAL VERIFICATION SUMMARY

### All Green? ✅
If all checks are marked, the database is **production-ready**:
- ✅ PostgreSQL installed and running
- ✅ Database created and populated
- ✅ All tables exist with correct structure
- ✅ All indexes created for performance
- ✅ Foreign keys enforce data integrity
- ✅ Server connects successfully
- ✅ Health endpoints respond
- ✅ Backend can query the database

### Next Steps
1. ✅ Stop dev server: `Ctrl+C`
2. ✅ Run production checks with different `.env`
3. ✅ Load test with concurrent users
4. ✅ Monitor database performance
5. ✅ Deploy to production

---

**For detailed table usage, see: DATABASE_IMPLEMENTATION_GUIDE.md**
**For audit details, see: DATABASE_AUDIT_REPORT.md**


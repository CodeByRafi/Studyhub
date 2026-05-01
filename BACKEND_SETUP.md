# 🚀 StudyHub Backend - Windows Setup Guide

## ✅ What's Done

- ✅ Node.js dependencies installed (`npm install` completed)
- ✅ `.env` file cleaned up
- ✅ Database setup script created (`setup-db.js`)

## 📋 PostgreSQL Installation (Windows)

### Option 1: Already Have PostgreSQL? ⭐ (Recommended if installed)

If you already have PostgreSQL installed on your Windows machine:

1. **Update `.env` with your database password:**
   ```
   DB_PASSWORD=your_actual_postgres_password_here
   ```

2. **Run the database setup script:**
   ```bash
   npm run setup-db
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

---

### Option 2: Install PostgreSQL (If not installed)

Download and install PostgreSQL:
- 🔗 **Download:** https://www.postgresql.org/download/windows/
- Use version 14 or 15 (latest stable)
- **Important:** Remember the password you set for `postgres` user

**Installation steps:**
1. Download the installer
2. Run it and follow the wizard
3. When prompted for password, set it to something you remember (or use `postgres`)
4. Default port is `5432` ✓
5. After installation, verify by opening "SQL Shell (psql)" from Start Menu

---

### Option 3: Using Docker (Advanced)

If you have Docker installed:

```bash
docker run --name studyhub-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

---

## 🔧 Setup Instructions

### Step 1: Update .env File

Edit `server/.env`:
```env
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD   ← Update this!
DB_NAME=studyhub

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Step 2: Run Database Setup

```bash
npm run setup-db
```

**Expected output:**
```
🔄 Checking if database exists...
✅ Creating database "studyhub"...
✅ Database created successfully!
🔄 Running schema...
✅ Schema created successfully!

✅ Database setup complete!
📍 Run "npm run dev" to start the server
```

**Troubleshooting errors:**

- **"password authentication failed"**
  - Your DB_PASSWORD in .env is wrong
  - Fix it and run `npm run setup-db` again

- **"connect ECONNREFUSED"**
  - PostgreSQL isn't running
  - Windows: Start → "postgresql" → SQL Shell (psql)
  - Or restart PostgreSQL service from Services

- **"role postgres does not exist"**
  - PostgreSQL isn't installed properly
  - Reinstall PostgreSQL

### Step 3: Start the Server

```bash
npm run dev
```

**Expected output:**
```
✅ Server running on port 5000
📍 Test DB: http://localhost:5000/test-db
📍 Signup: POST http://localhost:5000/api/auth/signup
📍 Login: POST http://localhost:5000/api/auth/login
```

---

## 🧪 Test the Server

### 1. Test Database Connection

```bash
curl http://localhost:5000/test-db
```

**Expected result:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "time": "2026-04-03T14:30:45.123Z"
}
```

### 2. Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"
```

**Expected result:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

---

## 📁 File Structure

```
server/
├── config/db.js              ← Database Pool connection
├── db/schema.sql             ← Database tables & schema
├── modules/auth/
│   ├── auth.service.js       ← Business logic
│   ├── auth.controller.js    ← Request handlers
│   └── auth.routes.js        ← Express routes
├── setup-db.js               ← Database initialization script ✨ NEW
├── server.js                 ← Main Express app
├── .env                      ← Your environment variables
├── .env.example              ← Template
├── package.json              ← Dependencies
├── node_modules/             ← Installed packages
└── README.md                 ← Full documentation
```

---

## 🛠️ Available Commands

```bash
npm run dev          # Start with auto-reload (development)
npm start            # Start normally (production)
npm run setup-db     # Initialize database (run once)
npm install          # Install dependencies
npm audit fix        # Fix security vulnerabilities
```

---

## ❓ Common Issues & Solutions

### Issue: "nodemon: command not found"
**Solution:** Dependencies weren't installed. Run:
```bash
npm install
```

### Issue: "Cannot find module 'pg'"
**Solution:** PostgreSQL driver not installed:
```bash
npm install pg
```

### Issue: "Database connection failed"
**Solution:** PostgreSQL not running or wrong credentials:
1. Check .env file credentials
2. Start PostgreSQL (Windows Services)
3. Try connecting with SQL Shell (psql) to verify

### Issue: Server doesn't start
**Solution:** Port 5000 might be in use:
```bash
# Change in .env
PORT=3000
```

---

## ✅ You're All Set!

Your backend is ready to go! Next steps:

1. **Frontend Connection** - Update your Next.js frontend to connect to `http://localhost:5000`
2. **Add More Routes** - Create modules for notes, courses, etc.
3. **Add Auth Middleware** - Protect routes with JWT validation
4. **Deploy** - Host on Heroku, Railway, or AWS

---

**Questions? Check `server/README.md` for full API documentation!** 🎉

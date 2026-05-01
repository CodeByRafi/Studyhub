# StudyHub Backend

A clean and minimal backend for StudyHub using Node.js, Express, and PostgreSQL with raw SQL.

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # Database connection pool
├── db/
│   └── schema.sql         # SQL schema for all tables
├── modules/
│   └── auth/
│       ├── auth.routes.js      # Auth routes
│       ├── auth.controller.js  # Auth request handlers
│       └── auth.service.js     # Auth business logic
├── server.js              # Main Express app
├── package.json           # Dependencies
└── .env.example           # Environment variables template
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup PostgreSQL

Make sure PostgreSQL is installed and running locally. Create a new database:

```sql
CREATE DATABASE studyhub;
```

### 3. Initialize Database Schema

Connect to the `studyhub` database and run:

```bash
psql -U postgres -d studyhub -f db/schema.sql
```

Or run this SQL:
```sql
\c studyhub
\i db/schema.sql
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=studyhub

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📍 API Endpoints

### Health Check
```
GET /test-db
```
Returns database connection status.

### Authentication

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📊 Database Schema

### Tables

1. **users** - User accounts with authentication
2. **departments** - Academic departments
3. **courses** - Courses in departments
4. **notes** - Study notes uploaded by users
5. **comments** - Comments on notes
6. **ratings** - Ratings for notes (1-5 stars)

All tables include `created_at` and `updated_at` timestamps.

## 🔒 Features

- ✅ Express.js server with proper middleware
- ✅ PostgreSQL database with raw SQL queries
- ✅ User signup/login with bcrypt password hashing
- ✅ JWT token-based authentication
- ✅ CORS enabled for frontend communication
- ✅ Environment variable configuration
- ✅ Database connection pooling
- ✅ Modular file structure (routes, controllers, services)
- ✅ Error handling
- ✅ Database health check endpoint

## 📦 Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client with connection pooling
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token generation and verification
- **cors** - CORS middleware
- **dotenv** - Environment variable configuration
- **nodemon** - Auto-reload during development

## 🔧 Testing with cURL or Postman

### Test Database Connection
```bash
curl http://localhost:5000/test-db
```

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📝 Notes

- Passwords are hashed using bcrypt before storing in the database
- JWT tokens expire after 7 days
- Password must be at least 6 characters
- Email must be unique
- Raw SQL is used instead of ORM for direct control
- Connection pooling ensures efficient database usage

## 🛠️ Next Steps

- Add middleware for JWT verification
- Add more routes (notes, courses, etc.)
- Add request validation middleware
- Add logging
- Add unit tests
- Deploy to production

---

**Happy coding! 🎉**

# StudyHub Database Implementation Guide

## Backend Developer Quick Reference

---

## Table Usage Guide

### 1. USERS Table
**Purpose:** Authentication and user identity

**Schema:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,      -- bcrypt hashed
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Create user
INSERT INTO users (email, password, first_name, last_name) 
VALUES ($1, $2, $3, $4)
RETURNING id, email, first_name, last_name;

// Login check
SELECT id, password FROM users WHERE email = $1;

// Get user profile
SELECT id, email, first_name, last_name FROM users WHERE id = $1;
```

---

### 2. DEPARTMENTS Table
**Purpose:** Academic department listing

**Schema:**
```sql
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// List all departments
SELECT id, name, description FROM departments ORDER BY name;

// Get single department
SELECT * FROM departments WHERE id = $1;
```

---

### 3. COURSES Table
**Purpose:** Link courses to departments

**Schema:**
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  department_id INT REFERENCES departments(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE,
  credits INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Get courses by department
SELECT id, name, code, department_id FROM courses 
WHERE department_id = $1 
ORDER BY name;

// Get all courses
SELECT id, name, code, department_id FROM courses ORDER BY name;

// Get single course
SELECT * FROM courses WHERE id = $1;
```

---

### 4. NOTES Table
**Purpose:** Store study notes with file attachments

**Schema:**
```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  file_url VARCHAR(500),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INT REFERENCES courses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Create note
INSERT INTO notes (title, content, file_url, user_id, course_id) 
VALUES ($1, $2, $3, $4, $5)
RETURNING id, title, file_url, user_id, course_id, created_at;

// Get all notes with details
SELECT 
  n.id, n.title, n.file_url, n.user_id, n.course_id, n.created_at,
  u.first_name, u.last_name,
  COUNT(DISTINCT c.id) as comment_count,
  ROUND(AVG(r.rating)::numeric, 1) as average_rating
FROM notes n
LEFT JOIN users u ON n.user_id = u.id
LEFT JOIN comments c ON n.id = c.note_id
LEFT JOIN ratings r ON n.id = r.note_id
WHERE n.course_id = $1
GROUP BY n.id, u.first_name, u.last_name
ORDER BY n.created_at DESC;

// Get single note with details
SELECT 
  n.id, n.title, n.content, n.file_url, n.user_id, n.course_id, n.created_at,
  u.first_name, u.last_name,
  COUNT(DISTINCT c.id) as comment_count,
  ROUND(AVG(r.rating)::numeric, 1) as average_rating,
  c.name as course_name
FROM notes n
LEFT JOIN users u ON n.user_id = u.id
LEFT JOIN comments ON n.id = comments.note_id
LEFT JOIN ratings r ON n.id = r.note_id
LEFT JOIN courses c ON n.course_id = c.id
WHERE n.id = $1
GROUP BY n.id, u.first_name, u.last_name, c.name;
```

---

### 5. COMMENTS Table
**Purpose:** Comments on study notes

**Schema:**
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_id INT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Add comment
INSERT INTO comments (content, user_id, note_id) 
VALUES ($1, $2, $3) 
RETURNING id, content, user_id, note_id, created_at;

// Get comments for note
SELECT 
  c.id, c.content, c.user_id, c.created_at,
  u.first_name, u.last_name
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.note_id = $1
ORDER BY c.created_at DESC;
```

---

### 6. RATINGS Table
**Purpose:** 1-5 star ratings for notes

**Schema:**
```sql
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_id INT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, note_id)  -- One rating per user per note
);
```

**Common Operations:**

```javascript
// Add or update rating (prevent duplicates)
INSERT INTO ratings (rating, user_id, note_id) 
VALUES ($1, $2, $3)
ON CONFLICT (user_id, note_id) DO UPDATE SET rating = $1
RETURNING id, rating, user_id, note_id;

// Get average rating for note
SELECT 
  ROUND(AVG(rating)::numeric, 1) as average_rating, 
  COUNT(*) as total_ratings
FROM ratings
WHERE note_id = $1;

// Check if user already rated
SELECT * FROM ratings WHERE user_id = $1 AND note_id = $2;
```

---

### 7. QUESTIONS Table
**Purpose:** Previous year exam questions

**Schema:**
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url VARCHAR(500),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INT REFERENCES courses(id) ON DELETE SET NULL,
  exam_year INT,
  exam_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Create question
INSERT INTO questions (title, file_url, user_id, course_id, exam_year, exam_type, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING id, title, file_url, user_id, course_id, created_at, updated_at;

// Get all questions
SELECT 
  q.id, q.title, q.file_url, q.user_id, q.course_id, q.exam_year, q.exam_type, q.created_at,
  u.first_name, u.last_name,
  COUNT(DISTINCT qc.id) as comment_count,
  ROUND(AVG(qr.rating)::numeric, 1) as average_rating
FROM questions q
LEFT JOIN users u ON q.user_id = u.id
LEFT JOIN question_comments qc ON q.id = qc.question_id
LEFT JOIN question_ratings qr ON q.id = qr.question_id
WHERE q.course_id = $1
GROUP BY q.id, u.first_name, u.last_name
ORDER BY q.exam_year DESC;

// Get single question
SELECT 
  q.id, q.title, q.file_url, q.user_id, q.course_id, q.exam_year, q.exam_type, q.created_at,
  u.first_name, u.last_name
FROM questions q
LEFT JOIN users u ON q.user_id = u.id
WHERE q.id = $1;
```

---

### 8. QUESTION_COMMENTS Table
**Purpose:** Comments on previous year questions

**Schema:**
```sql
CREATE TABLE question_comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Add comment to question
INSERT INTO question_comments (question_id, user_id, content, created_at, updated_at)
VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING id, question_id, user_id, content, created_at;

// Get comments for question
SELECT 
  qc.id, qc.content, qc.user_id, qc.question_id, qc.created_at,
  u.first_name, u.last_name, u.email
FROM question_comments qc
LEFT JOIN users u ON qc.user_id = u.id
WHERE qc.question_id = $1
ORDER BY qc.created_at DESC;
```

---

### 9. QUESTION_RATINGS Table
**Purpose:** 1-5 star ratings for questions

**Schema:**
```sql
CREATE TABLE question_ratings (
  id SERIAL PRIMARY KEY,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, question_id)  -- One rating per user per question
);
```

**Common Operations:**

```javascript
// Add or update rating
INSERT INTO question_ratings (question_id, user_id, rating, created_at, updated_at)
VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id, question_id) DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
RETURNING id, rating, user_id, question_id;
```

---

### 10. RESEARCH Table
**Purpose:** Research papers and documents

**Schema:**
```sql
CREATE TABLE research (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  abstract TEXT,
  file_url VARCHAR(500),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INT REFERENCES courses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Create research paper
INSERT INTO research (title, abstract, file_url, user_id, course_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

// Get all research papers
SELECT 
  r.id, r.title, r.abstract, r.file_url, r.user_id, r.course_id, r.created_at,
  u.first_name, u.last_name,
  COUNT(DISTINCT rc.id) as comment_count,
  ROUND(AVG(rr.rating)::numeric, 1) as average_rating
FROM research r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN research_comments rc ON r.id = rc.research_id
LEFT JOIN research_ratings rr ON r.id = rr.research_id
WHERE r.course_id = $1
GROUP BY r.id, u.first_name, u.last_name
ORDER BY r.created_at DESC;
```

---

### 11. RESEARCH_COMMENTS Table
**Purpose:** Comments on research papers

**Schema:**
```sql
CREATE TABLE research_comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  research_id INT NOT NULL REFERENCES research(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Common Operations:**

```javascript
// Add comment to research
INSERT INTO research_comments (research_id, user_id, content)
VALUES ($1, $2, $3)
RETURNING id, research_id, user_id, content, created_at;

// Get comments for research
SELECT 
  rc.id, rc.content, rc.user_id, rc.created_at,
  u.first_name, u.last_name
FROM research_comments rc
LEFT JOIN users u ON rc.user_id = u.id
WHERE rc.research_id = $1
ORDER BY rc.created_at DESC;
```

---

### 12. RESEARCH_RATINGS Table
**Purpose:** 1-5 star ratings for research

**Schema:**
```sql
CREATE TABLE research_ratings (
  id SERIAL PRIMARY KEY,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  research_id INT NOT NULL REFERENCES research(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, research_id)
);
```

---

## Relationship Diagram

```
users (PK: id)
  ├─→ notes (user_id)
  │   ├─→ comments (note_id)
  │   └─→ ratings (note_id, UNIQUE user_id)
  ├─→ questions (user_id)
  │   ├─→ question_comments (question_id)
  │   └─→ question_ratings (question_id, UNIQUE user_id)
  ├─→ research (user_id)
  │   ├─→ research_comments (research_id)
  │   └─→ research_ratings (research_id, UNIQUE user_id)
  ├─→ jobs (user_id)
  │   └─→ job_applications (user_id)
  ├─→ blog_posts (author_id)
  └─→ visits (user_id)

departments (PK: id)
  └─→ courses (department_id)
      ├─→ notes (course_id)
      ├─→ questions (course_id)
      └─→ research (course_id)
```

---

## Analytics Usage

### Total Activity by Content Type

```sql
-- All comments
SELECT 
  'notes' as content_type, COUNT(*) FROM comments
UNION
SELECT 'questions', COUNT(*) FROM question_comments
UNION
SELECT 'research', COUNT(*) FROM research_comments;

-- All ratings
SELECT 
  'notes' as content_type, COUNT(*), ROUND(AVG(rating)::numeric, 1) as avg_rating 
  FROM ratings GROUP BY 'notes'
UNION
SELECT 'questions', COUNT(*), ROUND(AVG(rating)::numeric, 1) 
  FROM question_ratings GROUP BY 'questions'
UNION
SELECT 'research', COUNT(*), ROUND(AVG(rating)::numeric, 1) 
  FROM research_ratings GROUP BY 'research';
```

---

## Best Practices

### ✅ DO
- Always use parameterized queries (`$1, $2, $3`) to prevent SQL injection
- Use foreign keys - they prevent orphaned records
- Check UNIQUE constraints before allowing duplicates (ratings by user)
- Use LEFT JOIN for optional relationships
- Create indexes on frequently queried columns (already done)

### ❌ DON'T
- Bypass foreign keys with raw IDs
- Forget timestamps (created_at, updated_at)
- Query all columns if you only need specific ones
- Delete users without understanding CASCADE effects

---

## Setup & Deployment

```bash
# 1. Install dependencies
cd server
npm install

# 2. Create database and tables
npm run setup-db

# 3. Start server
npm run dev

# 4. Test connection
curl http://localhost:5001/test-db
```

---

## Troubleshooting

### Database won't connect
- [ ] Is PostgreSQL running? `psql --version`
- [ ] Check `.env` file credentials
- [ ] Try: `psql -U postgres` to test local connection

### Tables missing
- [ ] Run `npm run setup-db` again
- [ ] Check `db/schema.sql` file exists

### Foreign key constraint errors
- [ ] Ensure referenced records exist
- [ ] Check ON DELETE behavior (CASCADE vs SET NULL)

---

**For questions or issues, refer to DATABASE_AUDIT_REPORT.md**


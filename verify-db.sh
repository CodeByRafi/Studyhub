User Action
    ↓
Select File (PDF/DOC/DOCX)
    ↓
Frontend Validation ✓
   - File type check (in allowed list)
   - File size check (< 50MB)
   - Required fields check
    ↓
Send to Backend with Bearer Token
    ↓
Backend Processing ✓
   - Auth middleware validates JWT
   - Multer validates MIME type
   - File saved with correct extension
   - Saved to: server/uploads/
    ↓
Database Insert ✓
   - Metadata saved (title, user_id, course_id, file_url)
   - Returns complete record
    ↓
Frontend Success ✓
   - Shows success message
   - Displays file in list with metadata
   - File accessible at /uploads/{filename}// Added MIME type support
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Now preserves file extension
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
}

// Validates against allowed types
fileFilter: (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word files (.pdf, .doc, .docx) are allowed'));
  }
}# Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm run dev

# In browser: http://localhost:3000#!/bin/bash

# StudyHub Database Verification Script
# Run this after deploying the database to ensure everything is working

echo "=================================================="
echo "StudyHub Database Verification Script"
echo "=================================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Check environment variables
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_NAME" ]; then
    echo "⚠️  Environment variables not set. Reading from .env file..."
    if [ ! -f server/.env ]; then
        echo "❌ .env file not found"
        exit 1
    fi
    source server/.env
fi

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Test connection
echo "Testing database connection..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT NOW();" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Could not connect to PostgreSQL"
    echo "   Make sure PostgreSQL is running and credentials are correct"
    exit 1
fi

echo "✅ Database connection successful"
echo ""

# Check tables
echo "Verifying tables..."
echo ""

TABLES=(
    "users"
    "departments"
    "courses"
    "notes"
    "comments"
    "ratings"
    "questions"
    "question_comments"
    "question_ratings"
    "research"
    "research_comments"
    "research_ratings"
    "jobs"
    "job_applications"
    "visits"
    "blog_posts"
)

for table in "${TABLES[@]}"; do
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1 FROM information_schema.tables WHERE table_name = '$table';" 2>/dev/null | grep -q "1"
    
    if [ $? -eq 0 ]; then
        # Get row count
        COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tc "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' ')
        echo "  ✅ $table ($COUNT rows)"
    else
        echo "  ❌ $table (NOT FOUND)"
    fi
done

echo ""
echo "Verifying indexes..."
echo ""

INDEXES=(
    "idx_users_email"
    "idx_notes_user_id"
    "idx_notes_course_id"
    "idx_comments_user_id"
    "idx_comments_note_id"
    "idx_ratings_user_id"
    "idx_ratings_note_id"
    "idx_questions_user_id"
    "idx_questions_course_id"
    "idx_question_comments_user_id"
    "idx_question_comments_question_id"
    "idx_question_ratings_user_id"
    "idx_question_ratings_question_id"
    "idx_research_user_id"
    "idx_research_comments_user_id"
    "idx_research_comments_research_id"
)

INDEX_COUNT=0
for index in "${INDEXES[@]}"; do
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1 FROM pg_indexes WHERE indexname = '$index';" 2>/dev/null | grep -q "1"
    
    if [ $? -eq 0 ]; then
        INDEX_COUNT=$((INDEX_COUNT + 1))
    fi
done

echo "  ✅ $INDEX_COUNT / ${#INDEXES[@]} indexes found"

echo ""
echo "=================================================="
echo "✅ Database verification complete!"
echo "=================================================="

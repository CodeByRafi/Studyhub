-- Migration: Add department_name and course_name to research table
ALTER TABLE research ADD COLUMN IF NOT EXISTS department_name VARCHAR(255);
ALTER TABLE research ADD COLUMN IF NOT EXISTS course_name VARCHAR(255);

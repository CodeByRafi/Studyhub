-- Migration: Seed default departments for search and upload filters
INSERT INTO departments (name, description)
SELECT 'Computer Science & Engineering', 'Department of Computer Science and Engineering'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Computer Science & Engineering');

INSERT INTO departments (name, description)
SELECT 'Electrical & Electronics Engineering', 'Department of Electrical and Electronics Engineering'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Electrical & Electronics Engineering');

INSERT INTO departments (name, description)
SELECT 'English', 'Department of English'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'English');

INSERT INTO departments (name, description)
SELECT 'Business Administration', 'Department of Business Administration'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Business Administration');

INSERT INTO departments (name, description)
SELECT 'Statistics & University', 'Department of Statistics and University Studies'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Statistics & University');

INSERT INTO departments (name, description)
SELECT 'Data Science', 'Department of Data Science'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Data Science');

INSERT INTO departments (name, description)
SELECT 'Economics', 'Department of Economics'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Economics');

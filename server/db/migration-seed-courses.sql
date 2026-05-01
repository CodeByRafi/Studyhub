-- Migration: Seed default courses for each department
-- CSE Courses
INSERT INTO courses (name, code, department_id, description)
SELECT 'Data Structures', 'CSE101', d.id, 'Fundamentals of data structures and algorithms'
FROM departments d WHERE d.name = 'Computer Science & Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Data Structures' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Algorithms', 'CSE102', d.id, 'Algorithm design and analysis'
FROM departments d WHERE d.name = 'Computer Science & Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Algorithms' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Database Management Systems', 'CSE201', d.id, 'Relational databases and SQL'
FROM departments d WHERE d.name = 'Computer Science & Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Database Management Systems' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Operating Systems', 'CSE202', d.id, 'Operating system concepts and design'
FROM departments d WHERE d.name = 'Computer Science & Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Operating Systems' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Web Development', 'CSE301', d.id, 'Web technologies and frameworks'
FROM departments d WHERE d.name = 'Computer Science & Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Web Development' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Artificial Intelligence', 'CSE401', d.id, 'AI concepts and applications'
FROM departments d WHERE d.name = 'Computer Science & Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Artificial Intelligence' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Machine Learning', 'CSE402', d.id, 'Machine learning algorithms'
FROM departments d WHERE d.name = 'Computer Science & Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Machine Learning' AND department_id = d.id);

-- EEE Courses
INSERT INTO courses (name, code, department_id, description)
SELECT 'Circuit Theory', 'EEE101', d.id, 'Electrical circuit analysis'
FROM departments d WHERE d.name = 'Electrical & Electronics Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Circuit Theory' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Electronics', 'EEE102', d.id, 'Electronic devices and circuits'
FROM departments d WHERE d.name = 'Electrical & Electronics Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Electronics' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Signals & Systems', 'EEE201', d.id, 'Signal processing and analysis'
FROM departments d WHERE d.name = 'Electrical & Electronics Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Signals & Systems' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Power Systems', 'EEE301', d.id, 'Power generation and distribution'
FROM departments d WHERE d.name = 'Electrical & Electronics Engineering'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Power Systems' AND department_id = d.id);

-- English Courses
INSERT INTO courses (name, code, department_id, description)
SELECT 'Literary Theory', 'ENG101', d.id, 'Theories of literature and criticism'
FROM departments d WHERE d.name = 'English'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Literary Theory' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Poetry', 'ENG102', d.id, 'Poetry analysis and composition'
FROM departments d WHERE d.name = 'English'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Poetry' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Academic Writing', 'ENG201', d.id, 'Professional writing skills'
FROM departments d WHERE d.name = 'English'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Academic Writing' AND department_id = d.id);

-- BBA Courses
INSERT INTO courses (name, code, department_id, description)
SELECT 'Accounting', 'BBA101', d.id, 'Financial and management accounting'
FROM departments d WHERE d.name = 'Business Administration'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Accounting' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Finance', 'BBA102', d.id, 'Financial management and analysis'
FROM departments d WHERE d.name = 'Business Administration'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Finance' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Marketing', 'BBA201', d.id, 'Marketing strategies and management'
FROM departments d WHERE d.name = 'Business Administration'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Marketing' AND department_id = d.id);

-- Data Science Courses
INSERT INTO courses (name, code, department_id, description)
SELECT 'Python for Data Science', 'DS101', d.id, 'Python programming for data analysis'
FROM departments d WHERE d.name = 'Data Science'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Python for Data Science' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Data Mining', 'DS102', d.id, 'Data mining techniques and applications'
FROM departments d WHERE d.name = 'Data Science'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Data Mining' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Data Visualization', 'DS201', d.id, 'Visualizing data for insights'
FROM departments d WHERE d.name = 'Data Science'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Data Visualization' AND department_id = d.id);

-- Economics Courses
INSERT INTO courses (name, code, department_id, description)
SELECT 'Microeconomics', 'ECON101', d.id, 'Individual and firm behavior'
FROM departments d WHERE d.name = 'Economics'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Microeconomics' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Macroeconomics', 'ECON102', d.id, 'National and global economy'
FROM departments d WHERE d.name = 'Economics'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Macroeconomics' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Econometrics', 'ECON201', d.id, 'Statistical methods in economics'
FROM departments d WHERE d.name = 'Economics'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Econometrics' AND department_id = d.id);

-- Statistics Courses
INSERT INTO courses (name, code, department_id, description)
SELECT 'Statistics', 'STAT101', d.id, 'Statistical methods and probability'
FROM departments d WHERE d.name = 'Statistics & University'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Statistics' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Probability', 'STAT102', d.id, 'Probability theory and distributions'
FROM departments d WHERE d.name = 'Statistics & University'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Probability' AND department_id = d.id);

INSERT INTO courses (name, code, department_id, description)
SELECT 'Inferential Statistics', 'STAT201', d.id, 'Hypothesis testing and inference'
FROM departments d WHERE d.name = 'Statistics & University'
AND NOT EXISTS (SELECT 1 FROM courses WHERE name = 'Inferential Statistics' AND department_id = d.id);

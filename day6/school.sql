-- ===============================================================
-- school.sql : a small school database (students, courses, enrolments)
-- Works in SQLite (e.g. sqliteonline.com). Safe to run again and again.
-- ===============================================================

PRAGMA foreign_keys = ON;   -- make SQLite enforce foreign keys

-- Remove old tables first (enrolments first, because it depends on the others)
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- ---------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------

CREATE TABLE students (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE          -- no two students share an email
);

CREATE TABLE courses (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    title   TEXT NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0)
);

-- The join table: one row = one student enrolled on one course
CREATE TABLE enrolments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id  INTEGER NOT NULL,
    course_id   INTEGER NOT NULL,
    grade       INTEGER CHECK (grade BETWEEN 0 AND 100),   -- empty (NULL) until marked
    enrolled_on TEXT NOT NULL DEFAULT (date('now')),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
    UNIQUE (student_id, course_id)      -- a student cannot join the same course twice
);

-- Speeds up "who is on this course?" searches (see school-design.md)
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);

-- ---------------------------------------------------------------
-- 2. SAMPLE DATA
-- ---------------------------------------------------------------

INSERT INTO students (id, name, email) VALUES
    (1, 'Amina Wanjiru',  'amina@school.ac.ke'),
    (2, 'Brian Otieno',   'brian@school.ac.ke'),
    (3, 'Cynthia Achieng','cynthia@school.ac.ke'),
    (4, 'David Kamau',    'david@school.ac.ke'),
    (5, 'Esther Mutua',   'esther@school.ac.ke');

INSERT INTO courses (id, title, credits) VALUES
    (1, 'Web Development',  4),
    (2, 'Databases',        3),
    (3, 'Python Basics',    3),
    (4, 'Cyber Security',   4);

INSERT INTO enrolments (student_id, course_id, grade) VALUES
    (1, 1, 88),
    (1, 2, 92),
    (1, 3, NULL),
    (2, 1, 75),
    (3, 1, 81),
    (3, 2, NULL),
    (4, 3, 67),
    (4, 2, 70);
-- Esther (id 5) has no enrolments, and "Cyber Security" has no students.

-- ---------------------------------------------------------------
-- 3. QUERIES
-- ---------------------------------------------------------------

-- Query 1: all courses for one student, found by name
SELECT c.title, c.credits, e.grade
FROM students AS s
JOIN enrolments AS e ON e.student_id = s.id
JOIN courses    AS c ON c.id = e.course_id
WHERE s.name = 'Amina Wanjiru';

-- Query 2: all students on one course
SELECT s.name, s.email, e.grade
FROM courses AS c
JOIN enrolments AS e ON e.course_id = c.id
JOIN students   AS s ON s.id = e.student_id
WHERE c.title = 'Web Development';

-- Query 3: the number of students on each course
-- (LEFT JOIN keeps courses with zero students; they show 0)
SELECT c.title, COUNT(e.id) AS number_of_students
FROM courses AS c
LEFT JOIN enrolments AS e ON e.course_id = c.id
GROUP BY c.id, c.title
ORDER BY number_of_students DESC, c.title;

-- Query 4: students who have no enrolments
SELECT s.id, s.name, s.email
FROM students AS s
LEFT JOIN enrolments AS e ON e.student_id = s.id
WHERE e.id IS NULL;

-- Query 5: update one enrolment's grade (Cynthia's mark for Databases)
UPDATE enrolments
SET grade = 85
WHERE student_id = (SELECT id FROM students WHERE name = 'Cynthia Achieng')
  AND course_id  = (SELECT id FROM courses  WHERE title = 'Databases');

-- Check the update worked
SELECT s.name, c.title, e.grade
FROM enrolments AS e
JOIN students AS s ON s.id = e.student_id
JOIN courses  AS c ON c.id = e.course_id
WHERE s.name = 'Cynthia Achieng';

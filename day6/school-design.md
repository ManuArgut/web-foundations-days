# School Database Design

This database stores the students of a school, the courses they can take, and which student is on which course (with their grade).

## The tables

### students
Holds one row per student: an `id` (primary key), the student's `name` and their `email`. The name and email cannot be empty, and the email is `UNIQUE` so two students can never share one address.

### courses
Holds one row per course: an `id` (primary key), the course `title` and the number of `credits`. Credits must be more than zero.

### enrolments
Holds one row for each time a student joins a course. It has its own `id`, a `student_id` and a `course_id` (both foreign keys), the `grade` (empty until the student is marked) and the date they enrolled. A `UNIQUE (student_id, course_id)` rule stops the same student joining the same course twice.

## The relationships

- **One-to-many:** one student can have many enrolments, but each enrolment belongs to exactly one student. The same is true for courses: one course has many enrolments, and each enrolment belongs to one course.
- **Many-to-many:** students and courses. One student can take many courses, and one course has many students.

**Why a join table is needed:** a single cell cannot hold a list of courses or students without breaking the rules of a good table design (for example, writing "Web, Databases" in one column makes searching, counting and updating messy). The `enrolments` table solves this by turning one many-to-many relationship into two simple one-to-many relationships. It is also the natural place to store the grade, because a grade belongs to the pair of student and course, not to the student or the course alone.

## An index I would add

```sql
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);
```

**Reason:** the `UNIQUE (student_id, course_id)` rule already creates an index that helps when we search by student. It cannot help when we search by course alone, such as "who is on this course?" or "how many students are on each course?". As the school grows to thousands of enrolments, an index on `course_id` lets the database jump straight to the right rows instead of reading the whole table.

## SQL or NoSQL?

I would choose SQL for this system. The data is clearly structured and full of relationships: students, courses and enrolments always have the same fields and link to each other. SQL enforces these links with foreign keys, stops duplicate emails and duplicate enrolments, and makes questions like "how many students are on each course?" or "which students have no courses?" easy to answer with joins. A school also needs the data to be correct (a grade must never be attached to a student who does not exist), and SQL databases protect this with transactions. NoSQL would be a better fit if the data had no fixed shape or needed to grow across many servers, such as millions of chat messages, but that is not the case for a school.

import { Router, Request, Response } from 'express';
import { getDb } from '../db/schema';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { v4 as uuid } from 'uuid';

const router = Router();

// --- Helpers ---

function buildCourseResponse(db: any, course: any) {
  const instructor = course.instructor_id
    ? db.prepare('SELECT * FROM instructors WHERE id = ?').get(course.instructor_id)
    : null;
  const audiences = db.prepare('SELECT audience FROM course_audiences WHERE course_id = ?').all(course.id).map((r: any) => r.audience);
  const objectives = db.prepare('SELECT objective FROM course_objectives WHERE course_id = ? ORDER BY sort_order').all(course.id).map((r: any) => r.objective);
  const prerequisites = db.prepare('SELECT prerequisite FROM course_prerequisites WHERE course_id = ?').all(course.id).map((r: any) => r.prerequisite);
  const schedules = db.prepare('SELECT * FROM schedules WHERE course_id = ?').all(course.id);
  const reviews = db.prepare('SELECT * FROM reviews WHERE course_id = ?').all(course.id);
  const relatedIds = db.prepare('SELECT related_course_id FROM related_courses WHERE course_id = ?').all(course.id).map((r: any) => r.related_course_id);

  const days = db.prepare('SELECT * FROM curriculum_days WHERE course_id = ? ORDER BY sort_order').all(course.id);
  const curriculum = days.map((day: any) => {
    const modules = db.prepare('SELECT * FROM curriculum_modules WHERE day_id = ? ORDER BY sort_order').all(day.id);
    return {
      dayTitle: day.day_title,
      modules: modules.map((mod: any) => {
        const topics = db.prepare('SELECT topic FROM module_topics WHERE module_id = ? ORDER BY sort_order').all(mod.id).map((t: any) => t.topic);
        return { title: mod.title, duration: mod.duration, topics };
      }),
    };
  });

  const allRatings = reviews.map((r: any) => r.rating);
  const total = allRatings.length;
  const average = total > 0 ? Math.round((allRatings.reduce((a: number, b: number) => a + b, 0) / total) * 10) / 10 : 0;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
  allRatings.forEach((r: number) => distribution[r]++);

  return {
    id: course.id,
    code: course.code,
    title: course.title,
    program: course.program,
    level: course.level,
    duration: course.duration,
    format: course.format,
    price: course.price,
    overview: course.overview,
    isPublished: !!course.is_published,
    sortOrder: course.sort_order,
    createdAt: course.created_at,
    updatedAt: course.updated_at,
    instructor,
    audience: audiences,
    objectives,
    prerequisites,
    schedules: schedules.map((s: any) => ({
      id: s.id, startDate: s.start_date, endDate: s.end_date,
      location: s.location, type: s.type, status: s.status,
      capacity: s.capacity, enrolled: s.enrolled,
    })),
    curriculum,
    reviewStats: { average, total, distribution },
    reviews: reviews.map((r: any) => ({
      id: r.id, author: r.author, role: r.role, date: r.date, rating: r.rating, text: r.text,
    })),
    relatedCourseIds: relatedIds,
  };
}

// =====================
// ADMIN CRUD ROUTES (protected) — must be before /:id
// =====================

// GET /api/courses/admin/all — list ALL courses (including unpublished)
router.get('/admin/all', verifyToken, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const courses = db.prepare('SELECT * FROM courses ORDER BY program, sort_order ASC, created_at ASC').all();
  res.json(courses.map((c: any) => buildCourseResponse(db, c)));
});

// =====================
// PUBLIC ROUTES
// =====================

// GET /api/courses — list all published courses
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { program, level, format } = req.query;

  let sql = 'SELECT * FROM courses WHERE is_published = 1';
  const params: any[] = [];

  if (program) { sql += ' AND program = ?'; params.push(program); }
  if (level) { sql += ' AND level = ?'; params.push(level); }
  if (format) { sql += ' AND format = ?'; params.push(format); }

  sql += ' ORDER BY sort_order ASC, created_at ASC';

  const courses = db.prepare(sql).all(...params);
  res.json(courses.map((c: any) => buildCourseResponse(db, c)));
});

// GET /api/courses/:id — single course detail
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(buildCourseResponse(db, course));
});

// =====================
// ADMIN MUTATION ROUTES (protected)
// =====================

// POST /api/courses/admin — create course
router.post('/admin', verifyToken, (req: AuthRequest, res: Response) => {
  const { code, title, program, level, duration, format, price, overview, instructorId, isPublished, audiences, objectives, prerequisites } = req.body;

  if (!code || !title || !program || !level || !duration) {
    return res.status(400).json({ error: 'code, title, program, level, and duration are required' });
  }

  const db = getDb();

  // Check unique code
  const existing = db.prepare('SELECT id FROM courses WHERE code = ?').get(code);
  if (existing) return res.status(409).json({ error: `Course code "${code}" already exists` });

  const id = uuid();
  const maxOrder = (db.prepare('SELECT MAX(sort_order) as m FROM courses WHERE program = ?').get(program) as any)?.m || 0;

  db.prepare(`
    INSERT INTO courses (id, code, title, program, level, duration, format, price, overview, instructor_id, is_published, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, code, title, program, level, duration, format || 'Classroom', price || 0, overview || '', instructorId || null, isPublished !== false ? 1 : 0, maxOrder + 1);

  // Insert arrays
  if (audiences?.length) {
    const ins = db.prepare('INSERT INTO course_audiences (course_id, audience) VALUES (?, ?)');
    audiences.forEach((a: string) => ins.run(id, a));
  }
  if (objectives?.length) {
    const ins = db.prepare('INSERT INTO course_objectives (course_id, objective, sort_order) VALUES (?, ?, ?)');
    objectives.forEach((o: string, i: number) => ins.run(id, o, i));
  }
  if (prerequisites?.length) {
    const ins = db.prepare('INSERT INTO course_prerequisites (course_id, prerequisite) VALUES (?, ?)');
    prerequisites.forEach((p: string) => ins.run(id, p));
  }

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  res.status(201).json(buildCourseResponse(db, course));
});

// PUT /api/courses/admin/:id — update course
router.put('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id) as any;
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const { code, title, program, level, duration, format, price, overview, instructorId, isPublished, sortOrder, audiences, objectives, prerequisites } = req.body;

  // Check unique code if changed
  if (code && code !== course.code) {
    const dup = db.prepare('SELECT id FROM courses WHERE code = ? AND id != ?').get(code, course.id);
    if (dup) return res.status(409).json({ error: `Course code "${code}" already exists` });
  }

  db.prepare(`
    UPDATE courses SET
      code = ?, title = ?, program = ?, level = ?, duration = ?,
      format = ?, price = ?, overview = ?, instructor_id = ?,
      is_published = ?, sort_order = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    code ?? course.code,
    title ?? course.title,
    program ?? course.program,
    level ?? course.level,
    duration ?? course.duration,
    format ?? course.format,
    price ?? course.price,
    overview ?? course.overview,
    instructorId !== undefined ? instructorId : course.instructor_id,
    isPublished !== undefined ? (isPublished ? 1 : 0) : course.is_published,
    sortOrder ?? course.sort_order,
    course.id
  );

  // Replace arrays if provided
  if (audiences !== undefined) {
    db.prepare('DELETE FROM course_audiences WHERE course_id = ?').run(course.id);
    const ins = db.prepare('INSERT INTO course_audiences (course_id, audience) VALUES (?, ?)');
    (audiences || []).forEach((a: string) => ins.run(course.id, a));
  }
  if (objectives !== undefined) {
    db.prepare('DELETE FROM course_objectives WHERE course_id = ?').run(course.id);
    const ins = db.prepare('INSERT INTO course_objectives (course_id, objective, sort_order) VALUES (?, ?, ?)');
    (objectives || []).forEach((o: string, i: number) => ins.run(course.id, o, i));
  }
  if (prerequisites !== undefined) {
    db.prepare('DELETE FROM course_prerequisites WHERE course_id = ?').run(course.id);
    const ins = db.prepare('INSERT INTO course_prerequisites (course_id, prerequisite) VALUES (?, ?)');
    (prerequisites || []).forEach((p: string) => ins.run(course.id, p));
  }

  const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(course.id);
  res.json(buildCourseResponse(db, updated));
});

// DELETE /api/courses/admin/:id — delete course
router.delete('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  // CASCADE will handle related tables
  db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Course deleted' });
});

// PATCH /api/courses/admin/:id/publish — toggle publish
router.patch('/admin/:id/publish', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id) as any;
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const newStatus = course.is_published ? 0 : 1;
  db.prepare('UPDATE courses SET is_published = ?, updated_at = datetime(\'now\') WHERE id = ?').run(newStatus, course.id);

  res.json({ success: true, isPublished: !!newStatus });
});

export default router;

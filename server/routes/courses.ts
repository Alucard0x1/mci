import { Router, Request, Response } from 'express';
import { getDb } from '../db/schema';

const router = Router();

function buildFullCourse(db: any, course: any) {
  const instructor = db.prepare('SELECT * FROM instructors WHERE id = ?').get(course.instructor_id);
  const audiences = db.prepare('SELECT audience FROM course_audiences WHERE course_id = ?').all(course.id).map((r: any) => r.audience);
  const objectives = db.prepare('SELECT objective FROM course_objectives WHERE course_id = ? ORDER BY sort_order').all(course.id).map((r: any) => r.objective);
  const prerequisites = db.prepare('SELECT prerequisite FROM course_prerequisites WHERE course_id = ?').all(course.id).map((r: any) => r.prerequisite);
  const schedules = db.prepare('SELECT * FROM schedules WHERE course_id = ?').all(course.id);
  const reviews = db.prepare('SELECT * FROM reviews WHERE course_id = ?').all(course.id);
  const relatedIds = db.prepare('SELECT related_course_id FROM related_courses WHERE course_id = ?').all(course.id).map((r: any) => r.related_course_id);

  // Build curriculum
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

  // Compute review stats
  const allRatings = reviews.map((r: any) => r.rating);
  const total = allRatings.length;
  const average = total > 0 ? Math.round((allRatings.reduce((a: number, b: number) => a + b, 0) / total) * 10) / 10 : 0;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
  allRatings.forEach((r: number) => distribution[r]++);

  return {
    id: course.id,
    code: course.code,
    title: course.title,
    category: course.category,
    level: course.level,
    duration: course.duration,
    price: course.price,
    overview: course.overview,
    instructor,
    audience: audiences,
    objectives,
    prerequisites,
    schedules: schedules.map((s: any) => ({
      id: s.id, startDate: s.start_date, endDate: s.end_date,
      location: s.location, type: s.type, status: s.status,
    })),
    curriculum,
    reviewStats: { average, total, distribution },
    reviews: reviews.map((r: any) => ({
      id: r.id, author: r.author, role: r.role, date: r.date, rating: r.rating, text: r.text,
    })),
    relatedCourseIds: relatedIds,
  };
}

// GET /api/courses
router.get('/', (_req: Request, res: Response) => {
  const db = getDb();
  const courses = db.prepare('SELECT * FROM courses').all();
  const full = courses.map((c: any) => buildFullCourse(db, c));
  res.json(full);
});

// GET /api/courses/:id
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(buildFullCourse(db, course));
});

export default router;

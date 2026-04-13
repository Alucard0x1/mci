import { Router, Request, Response } from 'express';
import { getDb } from '../db/schema';

const router = Router();

// GET /api/testimonials
router.get('/testimonials', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM testimonials').all());
});

// GET /api/alumni-logos
router.get('/alumni-logos', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM alumni_logos').all());
});

// GET /api/resources
router.get('/resources', (req: Request, res: Response) => {
  const db = getDb();
  const { category } = req.query;
  if (category && category !== 'All') {
    res.json(db.prepare('SELECT * FROM resources WHERE category = ?').all(category));
  } else {
    res.json(db.prepare('SELECT * FROM resources').all());
  }
});

// GET /api/instructors — moved to dedicated instructors route

// GET /api/calendar — all schedules with course info
router.get('/calendar', (req: Request, res: Response) => {
  const db = getDb();
  const { category, type } = req.query;

  let sql = `
    SELECT s.*, c.title as course_title, c.id as course_id, c.program
    FROM schedules s
    JOIN courses c ON s.course_id = c.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (category && category !== 'All') {
    sql += ' AND c.program = ?';
    params.push(category);
  }
  if (type && type !== 'All') {
    sql += ' AND s.type = ?';
    params.push(type);
  }

  sql += ' ORDER BY s.start_date ASC';

  const events = db.prepare(sql).all(...params);
  res.json(events.map((e: any) => ({
    id: e.id,
    startDate: e.start_date,
    endDate: e.end_date,
    location: e.location,
    type: e.type,
    status: e.status,
    courseTitle: e.course_title,
    courseId: e.course_id,
    category: e.program,
  })));
});

// POST /api/enquiries
router.post('/enquiries', (req: Request, res: Response) => {
  const { name, email, type, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  const db = getDb();
  db.prepare('INSERT INTO enquiries (name, email, type, message) VALUES (?,?,?,?)')
    .run(name, email, type || 'General Enquiry', message);
  res.status(201).json({ success: true, message: 'Enquiry submitted' });
});

// POST /api/syllabus-download
router.post('/syllabus-download', (req: Request, res: Response) => {
  const { courseId, email } = req.body;
  if (!courseId || !email) {
    return res.status(400).json({ error: 'courseId and email are required' });
  }
  const db = getDb();
  db.prepare('INSERT INTO syllabus_leads (course_id, email) VALUES (?,?)').run(courseId, email);
  res.status(201).json({ success: true });
});

// POST /api/waitlist
router.post('/waitlist', (req: Request, res: Response) => {
  const { courseId, email, scheduleInfo } = req.body;
  if (!courseId || !email) {
    return res.status(400).json({ error: 'courseId and email are required' });
  }
  const db = getDb();
  db.prepare('INSERT INTO waitlist (course_id, email, schedule_info) VALUES (?,?,?)')
    .run(courseId, email, scheduleInfo || null);
  res.status(201).json({ success: true });
});

export default router;

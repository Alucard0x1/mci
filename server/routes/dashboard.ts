import { Router, Response } from 'express';
import { getDb } from '../db/schema';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// All dashboard routes require auth
router.use(verifyToken);

// GET /api/dashboard/stats
router.get('/stats', (_req: AuthRequest, res: Response) => {
  const db = getDb();

  const courseCount = (db.prepare('SELECT COUNT(*) as c FROM courses').get() as any).c;
  const scheduleCount = (db.prepare('SELECT COUNT(*) as c FROM schedules').get() as any).c;
  const enquiryCount = (db.prepare('SELECT COUNT(*) as c FROM enquiries').get() as any).c;
  const leadCount = (db.prepare('SELECT COUNT(*) as c FROM syllabus_leads').get() as any).c;
  const waitlistCount = (db.prepare('SELECT COUNT(*) as c FROM waitlist').get() as any).c;

  // Courses by program
  const coursesByProgram = db.prepare('SELECT program, COUNT(*) as count FROM courses GROUP BY program').all();

  res.json({ courseCount, scheduleCount, enquiryCount, leadCount, waitlistCount, coursesByProgram });
});

// GET /api/dashboard/enquiries
router.get('/enquiries', (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 50').all();
  res.json(enquiries);
});

// GET /api/dashboard/leads
router.get('/leads', (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const leads = db.prepare(`
    SELECT sl.*, c.title as course_title 
    FROM syllabus_leads sl 
    JOIN courses c ON sl.course_id = c.id 
    ORDER BY sl.created_at DESC LIMIT 50
  `).all();
  res.json(leads);
});

// GET /api/dashboard/waitlist
router.get('/waitlist', (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT w.*, c.title as course_title 
    FROM waitlist w 
    JOIN courses c ON w.course_id = c.id 
    ORDER BY w.created_at DESC LIMIT 50
  `).all();
  res.json(items);
});

export default router;

import { Router, Request, Response } from 'express';
import { getDb } from '../db/schema';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { v4 as uuid } from 'uuid';

const router = Router();

// =====================
// PUBLIC
// =====================

// GET /api/instructors — all instructors
router.get('/', (_req: Request, res: Response) => {
  const db = getDb();
  const instructors = db.prepare('SELECT * FROM instructors ORDER BY name ASC').all();
  res.json(instructors.map((i: any) => ({
    id: i.id,
    name: i.name,
    title: i.title,
    bio: i.bio,
    imageUrl: i.image_url,
  })));
});

// GET /api/instructors/:id
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const i = db.prepare('SELECT * FROM instructors WHERE id = ?').get(req.params.id) as any;
  if (!i) return res.status(404).json({ error: 'Instructor not found' });

  // Include courses taught
  const courses = db.prepare('SELECT id, code, title, program, level FROM courses WHERE instructor_id = ?').all(i.id);

  res.json({
    id: i.id, name: i.name, title: i.title, bio: i.bio, imageUrl: i.image_url,
    courses,
  });
});

// =====================
// ADMIN CRUD
// =====================

// GET /api/instructors/admin/all
router.get('/admin/all', verifyToken, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const instructors = db.prepare('SELECT * FROM instructors ORDER BY name ASC').all();
  res.json(instructors.map((i: any) => {
    const courseCount = (db.prepare('SELECT COUNT(*) as c FROM courses WHERE instructor_id = ?').get(i.id) as any).c;
    return {
      id: i.id, name: i.name, title: i.title, bio: i.bio, imageUrl: i.image_url,
      courseCount,
    };
  }));
});

// POST /api/instructors/admin
router.post('/admin', verifyToken, (req: AuthRequest, res: Response) => {
  const { name, title, bio, imageUrl } = req.body;
  if (!name || !title) return res.status(400).json({ error: 'Name and title are required' });

  const db = getDb();
  const id = uuid();
  db.prepare('INSERT INTO instructors (id, name, title, bio, image_url) VALUES (?,?,?,?,?)')
    .run(id, name, title, bio || '', imageUrl || null);

  res.status(201).json({ id, name, title, bio: bio || '', imageUrl: imageUrl || null });
});

// PUT /api/instructors/admin/:id
router.put('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const instructor = db.prepare('SELECT * FROM instructors WHERE id = ?').get(req.params.id) as any;
  if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

  const { name, title, bio, imageUrl } = req.body;

  db.prepare('UPDATE instructors SET name = ?, title = ?, bio = ?, image_url = ? WHERE id = ?')
    .run(
      name ?? instructor.name,
      title ?? instructor.title,
      bio !== undefined ? bio : instructor.bio,
      imageUrl !== undefined ? imageUrl : instructor.image_url,
      instructor.id
    );

  const updated = db.prepare('SELECT * FROM instructors WHERE id = ?').get(instructor.id) as any;
  res.json({ id: updated.id, name: updated.name, title: updated.title, bio: updated.bio, imageUrl: updated.image_url });
});

// DELETE /api/instructors/admin/:id
router.delete('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const instructor = db.prepare('SELECT id FROM instructors WHERE id = ?').get(req.params.id);
  if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

  // Unlink courses (set instructor_id to null)
  db.prepare('UPDATE courses SET instructor_id = NULL WHERE instructor_id = ?').run(req.params.id);
  db.prepare('DELETE FROM instructors WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;

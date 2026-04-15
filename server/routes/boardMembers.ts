import { Router, Request, Response } from 'express';
import { getDb } from '../db/schema';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// =====================
// PUBLIC
// =====================

// GET /api/board-members — visible members
router.get('/', (_req: Request, res: Response) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM board_members WHERE is_visible = 1 ORDER BY sort_order ASC').all();
  res.json(members.map((m: any) => ({
    id: m.id, name: m.name, position: m.position, bio: m.bio,
    imageUrl: m.image_url, linkedinUrl: m.linkedin_url, sortOrder: m.sort_order,
  })));
});

// =====================
// ADMIN CRUD
// =====================

// GET /api/board-members/admin/all
router.get('/admin/all', verifyToken, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM board_members ORDER BY sort_order ASC').all();
  res.json(members.map((m: any) => ({
    id: m.id, name: m.name, position: m.position, bio: m.bio,
    imageUrl: m.image_url, linkedinUrl: m.linkedin_url,
    sortOrder: m.sort_order, isVisible: !!m.is_visible, createdAt: m.created_at,
  })));
});

// POST /api/board-members/admin
router.post('/admin', verifyToken, (req: AuthRequest, res: Response) => {
  const { name, position, bio, imageUrl, linkedinUrl } = req.body;
  if (!name || !position) return res.status(400).json({ error: 'Name and position are required' });

  const db = getDb();
  const maxOrder = (db.prepare('SELECT MAX(sort_order) as m FROM board_members').get() as any)?.m || 0;

  const result = db.prepare('INSERT INTO board_members (name, position, bio, image_url, linkedin_url, sort_order) VALUES (?,?,?,?,?,?)')
    .run(name, position, bio || '', imageUrl || null, linkedinUrl || null, maxOrder + 1);

  const member = db.prepare('SELECT * FROM board_members WHERE id = ?').get(result.lastInsertRowid) as any;
  res.status(201).json({
    id: member.id, name: member.name, position: member.position, bio: member.bio,
    imageUrl: member.image_url, linkedinUrl: member.linkedin_url,
    sortOrder: member.sort_order, isVisible: !!member.is_visible,
  });
});

// PUT /api/board-members/admin/:id
router.put('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM board_members WHERE id = ?').get(req.params.id) as any;
  if (!member) return res.status(404).json({ error: 'Board member not found' });

  const { name, position, bio, imageUrl, linkedinUrl, sortOrder, isVisible } = req.body;

  db.prepare('UPDATE board_members SET name=?, position=?, bio=?, image_url=?, linkedin_url=?, sort_order=?, is_visible=? WHERE id=?')
    .run(
      name ?? member.name, position ?? member.position,
      bio !== undefined ? bio : member.bio,
      imageUrl !== undefined ? imageUrl : member.image_url,
      linkedinUrl !== undefined ? linkedinUrl : member.linkedin_url,
      sortOrder ?? member.sort_order,
      isVisible !== undefined ? (isVisible ? 1 : 0) : member.is_visible,
      member.id
    );

  const updated = db.prepare('SELECT * FROM board_members WHERE id = ?').get(member.id) as any;
  res.json({
    id: updated.id, name: updated.name, position: updated.position, bio: updated.bio,
    imageUrl: updated.image_url, linkedinUrl: updated.linkedin_url,
    sortOrder: updated.sort_order, isVisible: !!updated.is_visible,
  });
});

// DELETE /api/board-members/admin/:id
router.delete('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const member = db.prepare('SELECT id FROM board_members WHERE id = ?').get(req.params.id);
  if (!member) return res.status(404).json({ error: 'Board member not found' });

  db.prepare('DELETE FROM board_members WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// PATCH /api/board-members/admin/:id/visibility
router.patch('/admin/:id/visibility', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM board_members WHERE id = ?').get(req.params.id) as any;
  if (!member) return res.status(404).json({ error: 'Board member not found' });

  const newVis = member.is_visible ? 0 : 1;
  db.prepare('UPDATE board_members SET is_visible = ? WHERE id = ?').run(newVis, member.id);
  res.json({ success: true, isVisible: !!newVis });
});

export default router;

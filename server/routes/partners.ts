import { Router, Request, Response } from 'express';
import { getDb } from '../db/schema';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// =====================
// PUBLIC
// =====================

// GET /api/partners — visible partners ordered by sort_order
router.get('/', (_req: Request, res: Response) => {
  const db = getDb();
  const partners = db.prepare('SELECT * FROM partners WHERE is_visible = 1 ORDER BY sort_order ASC').all();
  res.json(partners.map((p: any) => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logo_url,
    websiteUrl: p.website_url,
    sortOrder: p.sort_order,
  })));
});

// =====================
// ADMIN CRUD
// =====================

// GET /api/partners/admin/all — all partners including hidden
router.get('/admin/all', verifyToken, (_req: AuthRequest, res: Response) => {
  const db = getDb();
  const partners = db.prepare('SELECT * FROM partners ORDER BY sort_order ASC').all();
  res.json(partners.map((p: any) => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logo_url,
    websiteUrl: p.website_url,
    sortOrder: p.sort_order,
    isVisible: !!p.is_visible,
    createdAt: p.created_at,
  })));
});

// POST /api/partners/admin — create partner
router.post('/admin', verifyToken, (req: AuthRequest, res: Response) => {
  const { name, logoUrl, websiteUrl } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const db = getDb();
  const maxOrder = (db.prepare('SELECT MAX(sort_order) as m FROM partners').get() as any)?.m || 0;

  const result = db.prepare('INSERT INTO partners (name, logo_url, website_url, sort_order) VALUES (?,?,?,?)')
    .run(name, logoUrl || null, websiteUrl || null, maxOrder + 1);

  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(result.lastInsertRowid) as any;
  res.status(201).json({ id: partner.id, name: partner.name, logoUrl: partner.logo_url, websiteUrl: partner.website_url, sortOrder: partner.sort_order, isVisible: !!partner.is_visible });
});

// PUT /api/partners/admin/:id — update partner
router.put('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id) as any;
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  const { name, logoUrl, websiteUrl, sortOrder, isVisible } = req.body;

  db.prepare('UPDATE partners SET name = ?, logo_url = ?, website_url = ?, sort_order = ?, is_visible = ? WHERE id = ?')
    .run(
      name ?? partner.name,
      logoUrl !== undefined ? logoUrl : partner.logo_url,
      websiteUrl !== undefined ? websiteUrl : partner.website_url,
      sortOrder ?? partner.sort_order,
      isVisible !== undefined ? (isVisible ? 1 : 0) : partner.is_visible,
      partner.id
    );

  const updated = db.prepare('SELECT * FROM partners WHERE id = ?').get(partner.id) as any;
  res.json({ id: updated.id, name: updated.name, logoUrl: updated.logo_url, websiteUrl: updated.website_url, sortOrder: updated.sort_order, isVisible: !!updated.is_visible });
});

// DELETE /api/partners/admin/:id — delete partner
router.delete('/admin/:id', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const partner = db.prepare('SELECT id FROM partners WHERE id = ?').get(req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// PATCH /api/partners/admin/:id/visibility — toggle visibility
router.patch('/admin/:id/visibility', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id) as any;
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  const newVis = partner.is_visible ? 0 : 1;
  db.prepare('UPDATE partners SET is_visible = ? WHERE id = ?').run(newVis, partner.id);
  res.json({ success: true, isVisible: !!newVis });
});

export default router;

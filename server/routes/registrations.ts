import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { getDb } from '../db/schema';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { v4 as uuid } from 'uuid';
import { sendRegistrationConfirmation } from '../services/email';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-04-30.basil' as any });
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function generateRegNumber(db: any): string {
  const year = new Date().getFullYear();
  const count = (db.prepare("SELECT COUNT(*) as c FROM registrations WHERE registration_number LIKE ?").get(`MCI-${year}-%`) as any).c;
  return `MCI-${year}-${String(count + 1).padStart(4, '0')}`;
}

// =====================
// PUBLIC
// =====================

// POST /api/registrations — create registration
router.post('/', async (req: Request, res: Response) => {
  const { courseId, scheduleId, fullName, email, phone, company, jobTitle, country, poNumber, paymentMethod, promoCode } = req.body;

  if (!courseId || !fullName || !email || !paymentMethod) {
    return res.status(400).json({ error: 'courseId, fullName, email, and paymentMethod are required' });
  }

  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId) as any;
  if (!course) return res.status(404).json({ error: 'Course not found' });

  let schedule: any = null;
  if (scheduleId) {
    schedule = db.prepare('SELECT * FROM schedules WHERE id = ? AND course_id = ?').get(scheduleId, courseId) as any;
  }

  // Calculate pricing
  let subtotal = course.price || 0;
  let discount = 0;

  if (promoCode) {
    const promo = db.prepare("SELECT * FROM promo_codes WHERE code = ? AND is_active = 1").get(promoCode) as any;
    if (promo) {
      const now = new Date().toISOString();
      const validFrom = !promo.valid_from || promo.valid_from <= now;
      const validUntil = !promo.valid_until || promo.valid_until >= now;
      const hasUses = !promo.max_uses || promo.current_uses < promo.max_uses;

      if (validFrom && validUntil && hasUses) {
        if (promo.discount_type === 'percentage') {
          discount = subtotal * (promo.discount_value / 100);
        } else {
          discount = Math.min(promo.discount_value, subtotal);
        }
        db.prepare('UPDATE promo_codes SET current_uses = current_uses + 1 WHERE id = ?').run(promo.id);
      }
    }
  }

  const total = Math.max(0, subtotal - discount);
  const id = uuid();
  const regNumber = generateRegNumber(db);

  db.prepare(`
    INSERT INTO registrations (id, registration_number, course_id, schedule_id, full_name, email, phone, company, job_title, country, po_number, subtotal, discount, total, promo_code, payment_method, payment_status, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(id, regNumber, courseId, scheduleId || null, fullName, email, phone || null, company || null, jobTitle || null, country || null, poNumber || null, subtotal, discount, total, promoCode || null, paymentMethod, 'unpaid', 'pending_payment');

  // Update enrolled count
  if (scheduleId) {
    db.prepare('UPDATE schedules SET enrolled = enrolled + 1 WHERE id = ?').run(scheduleId);
  }

  res.status(201).json({ id, registrationNumber: regNumber, total, paymentMethod });
});

// POST /api/registrations/:id/checkout — create Stripe checkout session
router.post('/:id/checkout', async (req: Request, res: Response) => {
  const db = getDb();
  const reg = db.prepare('SELECT r.*, c.title as course_title, c.code as course_code FROM registrations r JOIN courses c ON r.course_id = c.id WHERE r.id = ?').get(req.params.id) as any;
  if (!reg) return res.status(404).json({ error: 'Registration not found' });
  if (reg.payment_status === 'paid') return res.status(400).json({ error: 'Already paid' });

  if (reg.payment_method !== 'card') {
    // For bank_transfer / invoice — mark as pending, send email
    db.prepare("UPDATE registrations SET status = 'pending_payment' WHERE id = ?").run(reg.id);

    const schedule = reg.schedule_id ? db.prepare('SELECT * FROM schedules WHERE id = ?').get(reg.schedule_id) as any : null;
    sendRegistrationConfirmation({
      to: reg.email, name: reg.full_name, registrationNumber: reg.registration_number,
      courseTitle: reg.course_title, courseCode: reg.course_code,
      scheduleDate: schedule ? `${schedule.start_date} to ${schedule.end_date}` : 'TBC',
      scheduleLocation: schedule ? schedule.location : 'TBC',
      total: reg.total, paymentMethod: reg.payment_method,
    });

    return res.json({ success: true, method: reg.payment_method, registrationNumber: reg.registration_number });
  }

  // Stripe checkout
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: reg.email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${reg.course_code} — ${reg.course_title}`,
            description: `Registration ${reg.registration_number}`,
          },
          unit_amount: Math.round(reg.total * 100),
        },
        quantity: 1,
      }],
      metadata: { registration_id: reg.id, registration_number: reg.registration_number },
      success_url: `${APP_URL}/register/confirmation/${reg.id}?status=success`,
      cancel_url: `${APP_URL}/register/confirmation/${reg.id}?status=cancelled`,
    });

    db.prepare('UPDATE registrations SET stripe_session_id = ? WHERE id = ?').run(session.id, reg.id);
    res.json({ checkoutUrl: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Payment session creation failed' });
  }
});

// GET /api/registrations/:id — get registration status
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const reg = db.prepare(`
    SELECT r.*, c.title as course_title, c.code as course_code, c.program,
           s.start_date, s.end_date, s.location as schedule_location, s.type as schedule_type
    FROM registrations r
    JOIN courses c ON r.course_id = c.id
    LEFT JOIN schedules s ON r.schedule_id = s.id
    WHERE r.id = ?
  `).get(req.params.id) as any;
  if (!reg) return res.status(404).json({ error: 'Registration not found' });

  res.json({
    id: reg.id, registrationNumber: reg.registration_number,
    status: reg.status, paymentStatus: reg.payment_status, paymentMethod: reg.payment_method,
    fullName: reg.full_name, email: reg.email, phone: reg.phone,
    company: reg.company, jobTitle: reg.job_title, country: reg.country,
    courseTitle: reg.course_title, courseCode: reg.course_code, program: reg.program,
    scheduleDate: reg.start_date ? `${reg.start_date} to ${reg.end_date}` : null,
    scheduleLocation: reg.schedule_location, scheduleType: reg.schedule_type,
    subtotal: reg.subtotal, discount: reg.discount, total: reg.total,
    promoCode: reg.promo_code, registrationNumber2: reg.registration_number,
    createdAt: reg.created_at, paidAt: reg.paid_at,
  });
});

// POST /api/registrations/validate-promo — validate promo code
router.post('/validate-promo', (req: Request, res: Response) => {
  const { code, courseId } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const db = getDb();
  const promo = db.prepare("SELECT * FROM promo_codes WHERE code = ? AND is_active = 1").get(code) as any;
  if (!promo) return res.status(404).json({ error: 'Invalid promo code' });

  const now = new Date().toISOString();
  if (promo.valid_from && promo.valid_from > now) return res.status(400).json({ error: 'Promo code not yet active' });
  if (promo.valid_until && promo.valid_until < now) return res.status(400).json({ error: 'Promo code expired' });
  if (promo.max_uses && promo.current_uses >= promo.max_uses) return res.status(400).json({ error: 'Promo code usage limit reached' });

  res.json({ valid: true, discountType: promo.discount_type, discountValue: promo.discount_value });
});

// =====================
// STRIPE WEBHOOK
// =====================
router.post('/webhook/stripe', async (req: Request, res: Response) => {
  // Note: For production, verify webhook signature with STRIPE_WEBHOOK_SECRET
  // This requires raw body parsing — configure in server/index.ts
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const regId = session.metadata?.registration_id;

    if (regId) {
      const db = getDb();
      db.prepare(`
        UPDATE registrations SET payment_status = 'paid', status = 'confirmed', 
        stripe_payment_intent = ?, paid_at = datetime('now') WHERE id = ?
      `).run(session.payment_intent, regId);

      // Send confirmation email
      const reg = db.prepare(`
        SELECT r.*, c.title as course_title, c.code as course_code
        FROM registrations r JOIN courses c ON r.course_id = c.id WHERE r.id = ?
      `).get(regId) as any;

      if (reg) {
        const schedule = reg.schedule_id ? db.prepare('SELECT * FROM schedules WHERE id = ?').get(reg.schedule_id) as any : null;
        sendRegistrationConfirmation({
          to: reg.email, name: reg.full_name, registrationNumber: reg.registration_number,
          courseTitle: reg.course_title, courseCode: reg.course_code,
          scheduleDate: schedule ? `${schedule.start_date} to ${schedule.end_date}` : 'TBC',
          scheduleLocation: schedule ? schedule.location : 'TBC',
          total: reg.total, paymentMethod: 'card',
        });
      }
    }
  }

  res.json({ received: true });
});

// =====================
// ADMIN
// =====================

// GET /api/registrations/admin/all
router.get('/admin/all', verifyToken, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const regs = db.prepare(`
    SELECT r.*, c.title as course_title, c.code as course_code
    FROM registrations r JOIN courses c ON r.course_id = c.id
    ORDER BY r.created_at DESC LIMIT 100
  `).all();

  res.json(regs.map((r: any) => ({
    id: r.id, registrationNumber: r.registration_number,
    status: r.status, paymentStatus: r.payment_status, paymentMethod: r.payment_method,
    fullName: r.full_name, email: r.email, company: r.company,
    courseTitle: r.course_title, courseCode: r.course_code,
    total: r.total, createdAt: r.created_at, paidAt: r.paid_at,
  })));
});

// PATCH /api/registrations/admin/:id/status — update status manually
router.patch('/admin/:id/status', verifyToken, (req: AuthRequest, res: Response) => {
  const { status, paymentStatus } = req.body;
  const db = getDb();
  const reg = db.prepare('SELECT * FROM registrations WHERE id = ?').get(req.params.id) as any;
  if (!reg) return res.status(404).json({ error: 'Registration not found' });

  if (status) db.prepare('UPDATE registrations SET status = ? WHERE id = ?').run(status, reg.id);
  if (paymentStatus) {
    db.prepare('UPDATE registrations SET payment_status = ? WHERE id = ?').run(paymentStatus, reg.id);
    if (paymentStatus === 'paid') {
      db.prepare("UPDATE registrations SET paid_at = datetime('now'), status = 'confirmed' WHERE id = ?").run(reg.id);
    }
  }

  res.json({ success: true });
});

export default router;

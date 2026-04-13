import { getDb, initDb } from './schema';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

export function seed() {
  const db = initDb();

  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get() as any;
  if (userCount.c > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  console.log('Seeding database...');

  // --- Admin user ---
  const adminId = uuid();
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)')
    .run(adminId, 'admin@mci-training.com', hash, 'Admin User', 'admin');

  // --- Instructors (placeholder from prospectus) ---
  const instructors = [
    { id: 'expert-1', name: 'Industry Expert 1', title: 'Senior Practitioner', bio: 'Industry practitioner with extensive experience in mission-critical infrastructure.' },
    { id: 'expert-2', name: 'Industry Expert 2', title: 'Senior Consultant', bio: 'Experienced consultant specializing in operational resilience and continuity planning.' },
    { id: 'expert-3', name: 'Industry Expert 3', title: 'Technical Director', bio: 'Technical director with deep expertise in data center design and cybersecurity.' },
    { id: 'expert-4', name: 'Industry Expert 4', title: 'Principal Advisor', bio: 'Principal advisor on digital infrastructure strategy and risk management.' },
  ];
  const insInstructor = db.prepare('INSERT INTO instructors (id, name, title, bio) VALUES (?, ?, ?, ?)');
  for (const i of instructors) insInstructor.run(i.id, i.name, i.title, i.bio);

  // --- Courses from MCI Prospectus ---
  const courses = [
    // ===== BUSINESS CONTINUITY MANAGEMENT =====
    // Foundation
    { id: 'bcm-f5-l1-001', code: 'BCM-F5-L1-001', title: 'Level 1 - Foundation Course leading to Organisation & Digital Resilience Leader (ODRL)', program: 'Business Continuity', level: 'Foundation', duration: '5 Days', format: 'Classroom' },
    { id: 'bcm-f5-l2-002', code: 'BCM-F5-L2-002', title: 'Level 2 - Intermediate Specialist Tracks leading to Organisation & Digital Resilience Specialist (ODRS)', program: 'Business Continuity', level: 'Foundation', duration: '5 Days', format: 'Classroom' },
    { id: 'bcm-f5-l2-003', code: 'BCM-F5-L2-003', title: 'Level 2 - Intermediate Specialist Tracks leading to Organisation & Digital Resilience Crisis Leader (ODRCL)', program: 'Business Continuity', level: 'Foundation', duration: '5 Days', format: 'Classroom' },
    { id: 'bcm-f5-l3-004', code: 'BCM-F5-L3-004', title: 'Level 3 - Advanced Practitioner Elite leading to Organisation & Digital Resilience Crisis Simulation & Exercise Professional (ODRCSEP)', program: 'Business Continuity', level: 'Foundation', duration: '5 Days', format: 'Classroom' },
    // Continuing Education (Online Modular)
    { id: 'bcm-s1-001', code: 'BCM-S1-001', title: 'Business Continuity Management Framework', program: 'Business Continuity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'bcm-s1-002', code: 'BCM-S1-002', title: 'Modern BIA & Operational Resilience Analytics', program: 'Business Continuity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'bcm-s1-003', code: 'BCM-S1-003', title: 'Risk Assessment for Today\'s BCM Integrated Critical Infrastructure Risk Management', program: 'Business Continuity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'bcm-s1-004', code: 'BCM-S1-004', title: 'BCM in the Age of Cyber, AI Disruption & Emerging Future Threats', program: 'Business Continuity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'bcm-s2-001', code: 'BCM-S2-001', title: 'BCM for Data Centers', program: 'Business Continuity', level: 'Continuing Education', duration: '2 Days', format: 'Online Modular' },
    { id: 'bcm-s3-001', code: 'BCM-S3-001', title: 'BCM: Business Continuity Management Leaders Workshop', program: 'Business Continuity', level: 'Continuing Education', duration: '3 Days', format: 'Online Modular' },
    { id: 'bcm-s3-002', code: 'BCM-S3-002', title: 'Internal Auditor for ISO22301 Business Continuity Management Systems', program: 'Business Continuity', level: 'Continuing Education', duration: '3 Days', format: 'Online Modular' },
    // Diploma
    { id: 'bcm-dip-001', code: 'BCM-DIP-001', title: 'Diploma in Organisation & Digital Resilience', program: 'Business Continuity', level: 'Diploma', duration: '48 Days', format: 'Classroom' },
    // Advanced Diploma
    { id: 'bcm-adip-001', code: 'BCM-ADIP-001', title: 'Advanced Diploma in Integrated Organisation & Digital Resilience', program: 'Business Continuity', level: 'Advanced Diploma', duration: '48 Days', format: 'Classroom' },
    // Executive Diploma
    { id: 'bcm-edip-001', code: 'BCM-EDIP-001', title: 'Executive Diploma in Strategic BCM for Integrated Organisation & Digital Resilience Leadership at National Level', program: 'Business Continuity', level: 'Executive Diploma', duration: '48 Days', format: 'Classroom' },

    // ===== DATA CENTERS =====
    // Foundation
    { id: 'ngdc-f5-001', code: 'NGDC-F5-001', title: 'Foundations of Applied Data Center Operations & Infrastructure', program: 'Data Center', level: 'Foundation', duration: '5 Days', format: 'Classroom' },
    { id: 'ngdc-f5-002', code: 'NGDC-F5-002', title: 'Lifecycle of Mission-Critical Data Centers', program: 'Data Center', level: 'Foundation', duration: '5 Days', format: 'Classroom' },
    // Continuing Education (Online Modular)
    { id: 'ngdc-s1-001', code: 'NGDC-S1-001', title: 'Applied AI Data Centers Overview (Strategic Awareness)', program: 'Data Center', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'ngdc-s1-002', code: 'NGDC-S1-002', title: 'Applied Data Centers: Mission-Critical & Operational Resilience Essentials (Strategic Awareness)', program: 'Data Center', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'ngdc-s1-003', code: 'NGDC-S1-003', title: 'Applied Data Centers: Sustainability & Energy Strategy in Data Centres (Strategic Awareness)', program: 'Data Center', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'ngdc-s1-004', code: 'NGDC-S1-004', title: 'Applied Data Centers: AI Workloads & High-Density Infrastructure (Strategic Awareness)', program: 'Data Center', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'ngdc-s3-001', code: 'NGDC-S3-001', title: 'Applied Data Centers: Technical Foundation Course (with Hands-on in Data Center Lab): Mission-Critical & Operational Resilience Essentials', program: 'Data Center', level: 'Continuing Education', duration: '3 Days', format: 'Online Modular' },
    // Diploma
    { id: 'ngdc-dip-001', code: 'NGDC-DIP-001', title: 'Diploma in Digital & Mission-Critical Data Centre Engineering & Operations', program: 'Data Center', level: 'Diploma', duration: '48 Days', format: 'Classroom' },
    // Advanced Diploma (3 tracks)
    { id: 'ngdc-adipss-001', code: 'NGDC-ADIPSS-001', title: 'Advanced Diploma as Strategic & Specialist Data Center Design & Construction (Track A)', program: 'Data Center', level: 'Advanced Diploma', duration: '144 Days', format: 'Classroom' },
    { id: 'ngdc-adipss-002', code: 'NGDC-ADIPSS-002', title: 'Advanced Diploma as Strategic & Specialist in Infrastructure, Operations & Resilience Leadership (Track B)', program: 'Data Center', level: 'Advanced Diploma', duration: '144 Days', format: 'Classroom' },
    { id: 'ngdc-adipss-003', code: 'NGDC-ADIPSS-003', title: 'Advanced Diploma as Strategic & Specialist in Sustainability & AI Infrastructure (Track C)', program: 'Data Center', level: 'Advanced Diploma', duration: '144 Days', format: 'Classroom' },
    // Executive Diploma
    { id: 'ngdc-edip-001', code: 'NGDC-EDIP-001', title: 'Executive Advanced Diploma in Data Center Strategy & Infrastructure Leadership (combination of all 3 Tracks)', program: 'Data Center', level: 'Executive Diploma', duration: '48 Days', format: 'Classroom' },

    // ===== CYBERSECURITY =====
    // Foundation
    { id: 'cysec-f5-001', code: 'CYSEC-F5-001', title: 'Cybersecurity Fundamentals for Modern Digital Infrastructure (Hands-on cyber attack simulations, tabletop exercises and Security assessment workshop)', program: 'Cybersecurity', level: 'Foundation', duration: '8 Days', format: 'Classroom' },
    // Continuing Education (Online Modular)
    { id: 'cysec-s1-001', code: 'CYSEC-S1-001', title: 'Cyberattack Awareness & Incident Response for Today\'s Digital Organisations', program: 'Cybersecurity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'cysec-s1-002', code: 'CYSEC-S1-002', title: 'Cybersecurity Fundamentals & Modern Threat Landscape', program: 'Cybersecurity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'cysec-s1-003', code: 'CYSEC-S1-003', title: 'Network Security Fundamentals for Cybersecurity', program: 'Cybersecurity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'cysec-s1-004', code: 'CYSEC-S1-004', title: 'Cyber Hygiene & Security Operations Basics', program: 'Cybersecurity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'cysec-s1-005', code: 'CYSEC-S1-005', title: 'Introduction to Ethical Hacking & Penetration Testing', program: 'Cybersecurity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'cysec-s1-006', code: 'CYSEC-S1-006', title: 'Introduction to Cyber Incident Response', program: 'Cybersecurity', level: 'Continuing Education', duration: '1 Day', format: 'Online Modular' },
    { id: 'cysec-s3-001', code: 'CYSEC-S3-001', title: 'Cybersecurity Incident Response & Threat Defence', program: 'Cybersecurity', level: 'Continuing Education', duration: '3 Days', format: 'Online Modular' },
    // Diploma
    { id: 'cysec-dip-001', code: 'CYSEC-DIP-001', title: 'Diploma in Cybersecurity Operations & Digital Defence', program: 'Cybersecurity', level: 'Diploma', duration: '48 Days', format: 'Classroom' },
    // Advanced Diploma (4 tracks)
    { id: 'cysec-adipss-001', code: 'CYSEC-ADIPSS-001', title: 'Advanced Specialist Diploma – Ethical Hacking & VAPT (Aligned: CEH, OSCP)', program: 'Cybersecurity', level: 'Advanced Diploma', duration: '48 Days', format: 'Classroom' },
    { id: 'cysec-adipss-002', code: 'CYSEC-ADIPSS-002', title: 'Advanced Specialist Diploma – Cybersecurity Governance & Risk (Aligned: CISSP, CISM)', program: 'Cybersecurity', level: 'Advanced Diploma', duration: '48 Days', format: 'Classroom' },
    { id: 'cysec-adipss-003', code: 'CYSEC-ADIPSS-003', title: 'Advanced Specialist Diploma – Cloud & Hybrid Security (Aligned: CCSP)', program: 'Cybersecurity', level: 'Advanced Diploma', duration: '48 Days', format: 'Classroom' },
    { id: 'cysec-adipss-004', code: 'CYSEC-ADIPSS-004', title: 'Advanced Specialist Diploma – Incident Response & Digital Forensics (Aligned: GCIH, GCFA)', program: 'Cybersecurity', level: 'Advanced Diploma', duration: '48 Days', format: 'Classroom' },
    // Executive Diploma
    { id: 'cysec-edip-001', code: 'CYSEC-EDIP-001', title: 'Executive Diploma in Strategic Cybersecurity & Digital Resilience Leadership – Industry & National Level', program: 'Cybersecurity', level: 'Executive Diploma', duration: '48 Days', format: 'Classroom' },
  ];

  const insCourse = db.prepare('INSERT INTO courses (id, code, title, program, level, duration, format) VALUES (?,?,?,?,?,?,?)');

  const seedAll = db.transaction(() => {
    let order = 0;
    for (const c of courses) {
      insCourse.run(c.id, c.code, c.title, c.program, c.level, c.duration, c.format);
      order++;
    }
  });
  seedAll();

  // --- Testimonials ---
  const insTestimonial = db.prepare('INSERT INTO testimonials (text, author, company) VALUES (?,?,?)');
  insTestimonial.run('The depth of knowledge provided by MCI was exceptional. We have implemented their frameworks across our global data centers.', 'James T., VP Operations', 'Global Tech Corp');
  insTestimonial.run('Structured, academic, and practical. The instructor was a true industry veteran.', 'Sarah L., Risk Manager', 'FinSecure Bank');

  // --- Resources ---
  const insResource = db.prepare('INSERT INTO resources (type, title, date, category, summary, image_url) VALUES (?,?,?,?,?,?)');
  insResource.run('Whitepaper', 'The Future of Green Data Centers', 'Jan 10, 2026', 'Data Center', 'An analysis of liquid cooling technologies and heat recovery systems for next-gen facilities.', 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=800');
  insResource.run('Webinar', 'NIS2 Directive: Compliance Roadmap', 'Dec 15, 2025', 'Cybersecurity', 'Watch our panel of experts discuss the implications of the new EU cybersecurity directive.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800');
  insResource.run('Case Study', 'Resilience in Banking: A 2025 Retrospective', 'Nov 22, 2025', 'Business Continuity', 'How a top-tier bank handled the global outage of 2025 using ISO 22301 frameworks.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800');
  insResource.run('Guide', 'SCADA Security Essentials', 'Oct 05, 2025', 'Cybersecurity', 'A definitive guide to securing operational technology environments against modern threats.', 'https://images.unsplash.com/photo-1551808525-51a943718d53?auto=format&fit=crop&q=80&w=800');
  insResource.run('Report', 'Global Data Center Market Trends 2026', 'Sep 12, 2025', 'Data Center', 'Market analysis focusing on the shift towards edge computing and sustainable infrastructure.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800');

  // --- Partners ---
  const insPartner = db.prepare('INSERT INTO partners (name, logo_url, sort_order) VALUES (?,?,?)');
  ['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4'].forEach((name, i) => {
    insPartner.run(name, null, i);
  });

  // Legacy logos table
  const insLogo = db.prepare('INSERT INTO alumni_logos (name, url) VALUES (?,?)');
  ['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4'].forEach(name => {
    insLogo.run(name, `https://placehold.co/120x40/white/111111?text=${encodeURIComponent(name)}`);
  });

  console.log('Database seeded successfully with MCI Prospectus data.');
}

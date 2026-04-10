import { getDb, initDb } from './schema';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

export function seed() {
  const db = initDb();

  // Check if already seeded
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

  // --- Instructors ---
  const instructors = [
    { id: 'dr-smith', name: 'Dr. Sarah Smith', title: 'Senior Cybersecurity Analyst', bio: 'Former CISO with 20 years of experience in critical infrastructure protection. Sarah has led security operations for Fortune 500 financial institutions and is a regular keynote speaker at Black Hat and RSA.', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
    { id: 'eng-jones', name: 'Michael Jones, CDCP', title: 'Data Center Infrastructure Specialist', bio: 'Lead auditor for ISO 22237 certification bodies globally. Michael has overseen the design and build of over 50MW of data center capacity across Europe and Asia.', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    { id: 'lisa-wong', name: 'Lisa Wong, MBCI', title: 'Business Resilience Consultant', bio: 'Expert in operational risk management for financial institutions. Lisa serves on the technical committee for ISO 22301 updates and advises government bodies on resilience strategies.', image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
    { id: 'james-chen', name: 'James Chen, CISSP', title: 'Cloud Security Architect', bio: 'Specializing in zero-trust architecture and cloud migration strategies for enterprise. James brings 15 years of hands-on experience in hybrid cloud environments.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  ];

  const insInstructor = db.prepare('INSERT INTO instructors (id, name, title, bio, image_url) VALUES (?, ?, ?, ?, ?)');
  for (const i of instructors) {
    insInstructor.run(i.id, i.name, i.title, i.bio, i.image_url);
  }

  // --- Courses ---
  const coursesData = [
    {
      id: 'dc-101', code: 'DCP-100', title: 'Certified Data Center Professional', category: 'Data Center',
      level: 'Intermediate', duration: '3 Days', price: 1800,
      overview: 'This comprehensive course covers the key components of data center design and operations, ensuring high availability and efficiency.',
      instructor_id: 'eng-jones',
      audiences: ['Data Center Managers', 'Facility Engineers', 'IT Operations Managers', 'Network Architects'],
      prerequisites: ['Basic understanding of IT infrastructure', 'No formal pre-qualifications required'],
      objectives: [
        'Understand Tier classifications (I, II, III, IV)',
        'Manage cooling and power efficiency (PUE)',
        'Implement physical security standards',
        'Design for maintainability and fault tolerance',
      ],
      schedules: [
        { id: 's1', start_date: '2026-03-10', end_date: '2026-03-12', location: 'London, UK', type: 'Classroom', status: 'Guaranteed' },
        { id: 's2', start_date: '2026-04-05', end_date: '2026-04-07', location: 'Virtual (GMT)', type: 'Virtual', status: 'Open' },
        { id: 's3', start_date: '2026-05-20', end_date: '2026-05-22', location: 'Singapore', type: 'Classroom', status: 'Limited' },
      ],
      curriculum: [
        {
          dayTitle: 'Day 1: Foundation & Infrastructure',
          modules: [
            { title: 'Data Center Standards', duration: '2 hours', topics: ['TIA-942', 'EN 50600', 'Uptime Institute Tiers'] },
            { title: 'Physical Location & Building', duration: '2.5 hours', topics: ['Site Selection', 'Floor Loading', 'Seismic Considerations'] },
            { title: 'Power Distribution', duration: '3 hours', topics: ['UPS Systems', 'Generators', 'Redundancy Levels (N, N+1, 2N)'] },
          ],
        },
        {
          dayTitle: 'Day 2: Cooling & Connectivity',
          modules: [
            { title: 'Cooling Management', duration: '3 hours', topics: ['Hot/Cold Aisle Containment', 'Psychrometric Charts', 'Liquid Cooling Trends'] },
            { title: 'Structured Cabling', duration: '2 hours', topics: ['Fiber vs Copper', 'Cable Management', 'Pathways'] },
            { title: 'Fire Protection', duration: '2 hours', topics: ['VESDA', 'Suppression Systems', 'Regulations'] },
          ],
        },
        {
          dayTitle: 'Day 3: Operations & Exam',
          modules: [
            { title: 'Physical Security', duration: '2 hours', topics: ['Access Control', 'Surveillance', 'Mantrap Design'] },
            { title: 'DCIM & Monitoring', duration: '2 hours', topics: ['Environmental Monitoring', 'Asset Management', 'Capacity Planning'] },
            { title: 'Final Examination', duration: '1.5 hours', topics: ['60-minute multiple choice exam', 'Certification ceremony'] },
          ],
        },
      ],
      reviews: [
        { id: 'r1', author: 'Marcus K.', role: 'Operations Lead', date: '2 weeks ago', rating: 5, text: 'The instructor knowledge was incredible. We implemented the cooling strategies immediately upon my return and saved 15% on energy costs.' },
        { id: 'r2', author: 'Sarah J.', role: 'Facility Manager', date: '1 month ago', rating: 4, text: 'Great content. The virtual platform worked surprisingly well for the group exercises.' },
      ],
      relatedCourseIds: ['bcm-200', 'cyb-300'],
    },
    {
      id: 'bcm-200', code: 'BCM-200', title: 'Business Continuity Management Systems (ISO 22301)', category: 'Business Continuity',
      level: 'Expert', duration: '5 Days', price: 2400,
      overview: 'Master the implementation of a Business Continuity Management System (BCMS) compliant with ISO 22301 standards.',
      instructor_id: 'lisa-wong',
      audiences: ['Risk Officers', 'Compliance Managers', 'BCM Leads'],
      prerequisites: ['Familiarity with ISO management systems', '2 years experience in risk or operations'],
      objectives: [
        'Conduct Business Impact Analysis (BIA)',
        'Develop recovery strategies and plans',
        'Lead internal audits and management reviews',
        'Manage crisis communications',
      ],
      schedules: [
        { id: 's4', start_date: '2026-03-15', end_date: '2026-03-19', location: 'Virtual (EST)', type: 'Virtual', status: 'Guaranteed' },
        { id: 's5', start_date: '2026-06-01', end_date: '2026-06-05', location: 'Dubai, UAE', type: 'Classroom', status: 'Open' },
      ],
      curriculum: [
        {
          dayTitle: 'Day 1: Introduction to ISO 22301',
          modules: [
            { title: 'Context of the Organization', duration: '3 hours', topics: ['Stakeholder Analysis', 'Scope Definition'] },
            { title: 'Leadership & Commitment', duration: '3 hours', topics: ['Management Buy-in', 'Policy Writing'] },
          ],
        },
        {
          dayTitle: 'Day 2: Planning & BIA',
          modules: [
            { title: 'Business Impact Analysis', duration: '4 hours', topics: ['RTO/RPO definition', 'Dependency Mapping'] },
            { title: 'Risk Assessment', duration: '3 hours', topics: ['Threat Identification', 'Vulnerability Analysis'] },
          ],
        },
      ],
      reviews: [
        { id: 'r3', author: 'David L.', role: 'Risk Manager', date: '3 weeks ago', rating: 5, text: 'Essential for anyone dealing with ISO audits. Lisa made the dry material very engaging.' },
      ],
      relatedCourseIds: ['dc-101', 'cyb-300'],
    },
    {
      id: 'cyb-300', code: 'CYB-300', title: 'Critical Infrastructure Cybersecurity', category: 'Cybersecurity',
      level: 'Expert', duration: '4 Days', price: 2100,
      overview: 'Advanced training on protecting critical infrastructure assets from sophisticated cyber threats and state-sponsored attacks.',
      instructor_id: 'dr-smith',
      audiences: ['Security Architects', 'Network Engineers', 'SCADA Operators'],
      prerequisites: ['Strong networking knowledge (TCP/IP)', 'Basic understanding of industrial control systems'],
      objectives: [
        'Analyze threat vectors in OT environments',
        'Implement defense-in-depth strategies',
        'Manage incident response for critical systems',
        'Navigate regulatory compliance (NIS2, CIP)',
      ],
      schedules: [
        { id: 's6', start_date: '2026-04-12', end_date: '2026-04-15', location: 'Virtual (CET)', type: 'Virtual', status: 'Limited' },
        { id: 's7', start_date: '2026-07-10', end_date: '2026-07-13', location: 'New York, USA', type: 'Classroom', status: 'Sold Out' },
      ],
      curriculum: [
        {
          dayTitle: 'Day 1: The Threat Landscape',
          modules: [
            { title: 'IT vs OT Security', duration: '3 hours', topics: ['CIA Triad vs AIC Triad', 'Air Gaps'] },
            { title: 'ICS Protocols', duration: '3 hours', topics: ['Modbus', 'DNP3', 'Vulnerability Assessment'] },
          ],
        },
      ],
      reviews: [
        { id: 'r4', author: 'Elena R.', role: 'SCADA Engineer', date: '2 months ago', rating: 5, text: 'Finally a course that understands the difference between IT and OT security.' },
      ],
      relatedCourseIds: ['dc-101', 'bcm-200'],
    },
  ];

  const insCourse = db.prepare('INSERT INTO courses (id, code, title, category, level, duration, price, overview, instructor_id) VALUES (?,?,?,?,?,?,?,?,?)');
  const insAudience = db.prepare('INSERT INTO course_audiences (course_id, audience) VALUES (?,?)');
  const insObjective = db.prepare('INSERT INTO course_objectives (course_id, objective, sort_order) VALUES (?,?,?)');
  const insPrereq = db.prepare('INSERT INTO course_prerequisites (course_id, prerequisite) VALUES (?,?)');
  const insSchedule = db.prepare('INSERT INTO schedules (id, course_id, start_date, end_date, location, type, status) VALUES (?,?,?,?,?,?,?)');
  const insDay = db.prepare('INSERT INTO curriculum_days (course_id, day_title, sort_order) VALUES (?,?,?)');
  const insModule = db.prepare('INSERT INTO curriculum_modules (day_id, title, duration, sort_order) VALUES (?,?,?,?)');
  const insTopic = db.prepare('INSERT INTO module_topics (module_id, topic, sort_order) VALUES (?,?,?)');
  const insReview = db.prepare('INSERT INTO reviews (id, course_id, author, role, date, rating, text) VALUES (?,?,?,?,?,?,?)');
  const insRelated = db.prepare('INSERT INTO related_courses (course_id, related_course_id) VALUES (?,?)');

  const seedCourses = db.transaction(() => {
    for (const c of coursesData) {
      insCourse.run(c.id, c.code, c.title, c.category, c.level, c.duration, c.price, c.overview, c.instructor_id);
      c.audiences.forEach(a => insAudience.run(c.id, a));
      c.objectives.forEach((o, i) => insObjective.run(c.id, o, i));
      c.prerequisites.forEach(p => insPrereq.run(c.id, p));
      c.schedules.forEach(s => insSchedule.run(s.id, c.id, s.start_date, s.end_date, s.location, s.type, s.status));

      for (let di = 0; di < c.curriculum.length; di++) {
        const day = c.curriculum[di];
        const dayResult = insDay.run(c.id, day.dayTitle, di);
        const dayId = dayResult.lastInsertRowid;
        for (let mi = 0; mi < day.modules.length; mi++) {
          const mod = day.modules[mi];
          const modResult = insModule.run(dayId, mod.title, mod.duration, mi);
          const modId = modResult.lastInsertRowid;
          mod.topics.forEach((t, ti) => insTopic.run(modId, t, ti));
        }
      }

      c.reviews.forEach(r => insReview.run(r.id, c.id, r.author, r.role, r.date, r.rating, r.text));
    }

    // Insert related courses AFTER all courses exist
    for (const c of coursesData) {
      c.relatedCourseIds.forEach(rid => insRelated.run(c.id, rid));
    }
  });
  seedCourses();

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

  // --- Alumni Logos ---
  const insLogo = db.prepare('INSERT INTO alumni_logos (name, url) VALUES (?,?)');
  ['Google', 'Amazon', 'Microsoft', 'HSBC', 'Equinix', 'Siemens'].forEach(name => {
    insLogo.run(name, `https://placehold.co/120x40/white/111111?text=${name}`);
  });

  console.log('Database seeded successfully.');
}

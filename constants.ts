import { Course, Instructor } from './types';

export const INSTRUCTORS: Record<string, Instructor> = {
  'dr-smith': {
    id: 'dr-smith',
    name: 'Dr. Sarah Smith',
    title: 'Senior Cybersecurity Analyst',
    bio: 'Former CISO with 20 years of experience in critical infrastructure protection. Sarah has led security operations for Fortune 500 financial institutions and is a regular keynote speaker at Black Hat and RSA.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  'eng-jones': {
    id: 'eng-jones',
    name: 'Michael Jones, CDCP',
    title: 'Data Center Infrastructure Specialist',
    bio: 'Lead auditor for ISO 22237 certification bodies globally. Michael has overseen the design and build of over 50MW of data center capacity across Europe and Asia.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  },
  'lisa-wong': {
    id: 'lisa-wong',
    name: 'Lisa Wong, MBCI',
    title: 'Business Resilience Consultant',
    bio: 'Expert in operational risk management for financial institutions. Lisa serves on the technical committee for ISO 22301 updates and advises government bodies on resilience strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
  },
  'james-chen': {
    id: 'james-chen',
    name: 'James Chen, CISSP',
    title: 'Cloud Security Architect',
    bio: 'Specializing in zero-trust architecture and cloud migration strategies for enterprise. James brings 15 years of hands-on experience in hybrid cloud environments.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
};

export const COURSES: Course[] = [
  {
    id: 'dc-101',
    code: 'DCP-100',
    title: 'Certified Data Center Professional',
    category: 'Data Center',
    level: 'Intermediate',
    duration: '3 Days',
    price: 1800,
    overview: 'This comprehensive course covers the key components of data center design and operations, ensuring high availability and efficiency. Students will learn how to setup and improve key aspects such as power, cooling, security, cabling, safety to ensure a high-availability data center.',
    audience: ['Data Center Managers', 'Facility Engineers', 'IT Operations Managers', 'Network Architects'],
    prerequisites: ['Basic understanding of IT infrastructure', 'No formal pre-qualifications required'],
    objectives: [
      'Understand Tier classifications (I, II, III, IV)',
      'Manage cooling and power efficiency (PUE)',
      'Implement physical security standards',
      'Design for maintainability and fault tolerance'
    ],
    instructor: INSTRUCTORS['eng-jones'],
    schedules: [
      { id: 's1', startDate: '2026-03-10', endDate: '2026-03-12', location: 'London, UK', type: 'Classroom', status: 'Guaranteed' },
      { id: 's2', startDate: '2026-04-05', endDate: '2026-04-07', location: 'Virtual (GMT)', type: 'Virtual', status: 'Open' },
      { id: 's3', startDate: '2026-05-20', endDate: '2026-05-22', location: 'Singapore', type: 'Classroom', status: 'Limited' }
    ],
    curriculum: [
      {
        dayTitle: 'Day 1: Foundation & Infrastructure',
        modules: [
          { title: 'Data Center Standards', duration: '2 hours', topics: ['TIA-942', 'EN 50600', 'Uptime Institute Tiers'] },
          { title: 'Physical Location & Building', duration: '2.5 hours', topics: ['Site Selection', 'Floor Loading', 'Seismic Considerations'] },
          { title: 'Power Distribution', duration: '3 hours', topics: ['UPS Systems', 'Generators', 'Redundancy Levels (N, N+1, 2N)'] }
        ]
      },
      {
        dayTitle: 'Day 2: Cooling & Connectivity',
        modules: [
          { title: 'Cooling Management', duration: '3 hours', topics: ['Hot/Cold Aisle Containment', 'Psychrometric Charts', 'Liquid Cooling Trends'] },
          { title: 'Structured Cabling', duration: '2 hours', topics: ['Fiber vs Copper', 'Cable Management', 'Pathways'] },
          { title: 'Fire Protection', duration: '2 hours', topics: ['VESDA', 'Suppression Systems', 'Regulations'] }
        ]
      },
      {
        dayTitle: 'Day 3: Operations & Exam',
        modules: [
          { title: 'Physical Security', duration: '2 hours', topics: ['Access Control', 'Surveillance', 'Mantrap Design'] },
          { title: 'DCIM & Monitoring', duration: '2 hours', topics: ['Environmental Monitoring', 'Asset Management', 'Capacity Planning'] },
          { title: 'Final Examination', duration: '1.5 hours', topics: ['60-minute multiple choice exam', 'Certification ceremony'] }
        ]
      }
    ],
    reviewStats: {
      average: 4.8,
      total: 124,
      distribution: { 5: 85, 4: 12, 3: 3, 2: 0, 1: 0 }
    },
    reviews: [
      { id: 'r1', author: 'Marcus K.', role: 'Operations Lead', date: '2 weeks ago', rating: 5, text: 'The instructor knowledge was incredible. We implemented the cooling strategies immediately upon my return and saved 15% on energy costs.' },
      { id: 'r2', author: 'Sarah J.', role: 'Facility Manager', date: '1 month ago', rating: 4, text: 'Great content. The virtual platform worked surprisingly well for the group exercises.' }
    ],
    relatedCourseIds: ['bcm-200', 'cyb-300']
  },
  {
    id: 'bcm-200',
    code: 'BCM-200',
    title: 'Business Continuity Management Systems (ISO 22301)',
    category: 'Business Continuity',
    level: 'Expert',
    duration: '5 Days',
    price: 2400,
    overview: 'Master the implementation of a Business Continuity Management System (BCMS) compliant with ISO 22301 standards. This lead implementer course prepares you to lead a BCM program from inception to certification.',
    audience: ['Risk Officers', 'Compliance Managers', 'BCM Leads'],
    prerequisites: ['Familiarity with ISO management systems', '2 years experience in risk or operations'],
    objectives: [
      'Conduct Business Impact Analysis (BIA)',
      'Develop recovery strategies and plans',
      'Lead internal audits and management reviews',
      'Manage crisis communications'
    ],
    instructor: INSTRUCTORS['lisa-wong'],
    schedules: [
      { id: 's4', startDate: '2026-03-15', endDate: '2026-03-19', location: 'Virtual (EST)', type: 'Virtual', status: 'Guaranteed' },
      { id: 's5', startDate: '2026-06-01', endDate: '2026-06-05', location: 'Dubai, UAE', type: 'Classroom', status: 'Open' }
    ],
    curriculum: [
      {
        dayTitle: 'Day 1: Introduction to ISO 22301',
        modules: [
           { title: 'Context of the Organization', duration: '3 hours', topics: ['Stakeholder Analysis', 'Scope Definition'] },
           { title: 'Leadership & Commitment', duration: '3 hours', topics: ['Management Buy-in', 'Policy Writing'] }
        ]
      },
      {
        dayTitle: 'Day 2: Planning & BIA',
        modules: [
           { title: 'Business Impact Analysis', duration: '4 hours', topics: ['RTO/RPO definition', 'Dependency Mapping'] },
           { title: 'Risk Assessment', duration: '3 hours', topics: ['Threat Identification', 'Vulnerability Analysis'] }
        ]
      }
    ],
    reviewStats: {
      average: 4.7,
      total: 89,
      distribution: { 5: 60, 4: 25, 3: 4, 2: 0, 1: 0 }
    },
    reviews: [
      { id: 'r3', author: 'David L.', role: 'Risk Manager', date: '3 weeks ago', rating: 5, text: 'Essential for anyone dealing with ISO audits. Lisa made the dry material very engaging.' }
    ],
    relatedCourseIds: ['dc-101', 'cyb-300']
  },
  {
    id: 'cyb-300',
    code: 'CYB-300',
    title: 'Critical Infrastructure Cybersecurity',
    category: 'Cybersecurity',
    level: 'Expert',
    duration: '4 Days',
    price: 2100,
    overview: 'Advanced training on protecting critical infrastructure assets from sophisticated cyber threats and state-sponsored attacks. Focuses on SCADA/ICS security and convergence of IT/OT.',
    audience: ['Security Architects', 'Network Engineers', 'SCADA Operators'],
    prerequisites: ['Strong networking knowledge (TCP/IP)', 'Basic understanding of industrial control systems'],
    objectives: [
      'Analyze threat vectors in OT environments',
      'Implement defense-in-depth strategies',
      'Manage incident response for critical systems',
      'Navigate regulatory compliance (NIS2, CIP)'
    ],
    instructor: INSTRUCTORS['dr-smith'],
    schedules: [
      { id: 's6', startDate: '2026-04-12', endDate: '2026-04-15', location: 'Virtual (CET)', type: 'Virtual', status: 'Limited' },
      { id: 's7', startDate: '2026-07-10', endDate: '2026-07-13', location: 'New York, USA', type: 'Classroom', status: 'Sold Out' }
    ],
    curriculum: [
      {
        dayTitle: 'Day 1: The Threat Landscape',
        modules: [
           { title: 'IT vs OT Security', duration: '3 hours', topics: ['CIA Triad vs AIC Triad', 'Air Gaps'] },
           { title: 'ICS Protocols', duration: '3 hours', topics: ['Modbus', 'DNP3', 'Vulnerability Assessment'] }
        ]
      }
    ],
    reviewStats: {
      average: 4.9,
      total: 45,
      distribution: { 5: 41, 4: 3, 3: 1, 2: 0, 1: 0 }
    },
    reviews: [
       { id: 'r4', author: 'Elena R.', role: 'SCADA Engineer', date: '2 months ago', rating: 5, text: 'Finally a course that understands the difference between IT and OT security.' }
    ],
    relatedCourseIds: ['dc-101', 'bcm-200']
  }
];

export const TESTIMONIALS = [
  {
    text: "The depth of knowledge provided by MCI was exceptional. We have implemented their frameworks across our global data centers.",
    author: "James T., VP Operations",
    company: "Global Tech Corp"
  },
  {
    text: "Structured, academic, and practical. The instructor was a true industry veteran.",
    author: "Sarah L., Risk Manager",
    company: "FinSecure Bank"
  }
];

export const RESOURCES = [
  {
    id: 1,
    type: 'Whitepaper',
    title: 'The Future of Green Data Centers',
    date: 'Jan 10, 2026',
    category: 'Data Center',
    summary: 'An analysis of liquid cooling technologies and heat recovery systems for next-gen facilities.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    type: 'Webinar',
    title: 'NIS2 Directive: Compliance Roadmap',
    date: 'Dec 15, 2025',
    category: 'Cybersecurity',
    summary: 'Watch our panel of experts discuss the implications of the new EU cybersecurity directive for critical entities.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    type: 'Case Study',
    title: 'Resilience in Banking: A 2025 Retrospective',
    date: 'Nov 22, 2025',
    category: 'Business Continuity',
    summary: 'How a top-tier bank handled the global outage of 2025 using ISO 22301 frameworks.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    type: 'Guide',
    title: 'SCADA Security Essentials',
    date: 'Oct 05, 2025',
    category: 'Cybersecurity',
    summary: 'A definitive guide to securing operational technology environments against modern threats.',
    imageUrl: 'https://images.unsplash.com/photo-1551808525-51a943718d53?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    type: 'Report',
    title: 'Global Data Center Market Trends 2026',
    date: 'Sep 12, 2025',
    category: 'Data Center',
    summary: 'Market analysis focusing on the shift towards edge computing and sustainable infrastructure.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  }
];

export const ALUMNI_LOGOS = [
  { name: 'Google', url: 'https://placehold.co/120x40/white/111111?text=Google' },
  { name: 'Amazon', url: 'https://placehold.co/120x40/white/111111?text=Amazon' },
  { name: 'Microsoft', url: 'https://placehold.co/120x40/white/111111?text=Microsoft' },
  { name: 'HSBC', url: 'https://placehold.co/120x40/white/111111?text=HSBC' },
  { name: 'Equinix', url: 'https://placehold.co/120x40/white/111111?text=Equinix' },
  { name: 'Siemens', url: 'https://placehold.co/120x40/white/111111?text=Siemens' }
];
import { Course, Instructor } from './types';

// Legacy static data — kept for backward compatibility
// All data now comes from the API (backend database)

export const INSTRUCTORS: Record<string, Instructor> = {};

export const COURSES: Course[] = [];

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
    id: 1, type: 'Whitepaper', title: 'The Future of Green Data Centers', date: 'Jan 10, 2026', category: 'Data Center',
    summary: 'An analysis of liquid cooling technologies and heat recovery systems for next-gen facilities.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2, type: 'Webinar', title: 'NIS2 Directive: Compliance Roadmap', date: 'Dec 15, 2025', category: 'Cybersecurity',
    summary: 'Watch our panel of experts discuss the implications of the new EU cybersecurity directive.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3, type: 'Case Study', title: 'Resilience in Banking: A 2025 Retrospective', date: 'Nov 22, 2025', category: 'Business Continuity',
    summary: 'How a top-tier bank handled the global outage of 2025 using ISO 22301 frameworks.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
  },
];

export const ALUMNI_LOGOS = [
  { name: 'Partner 1', url: 'https://placehold.co/120x40/white/111111?text=Partner+1' },
  { name: 'Partner 2', url: 'https://placehold.co/120x40/white/111111?text=Partner+2' },
];

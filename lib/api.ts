const API_BASE = 'http://localhost:3001/api';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('mci_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // Public
  getCourses: () => request('/courses'),
  getCourse: (id: string) => request(`/courses/${id}`),
  getTestimonials: () => request('/testimonials'),
  getAlumniLogos: () => request('/alumni-logos'),
  getResources: (category?: string) => request(`/resources${category ? `?category=${category}` : ''}`),
  getInstructors: () => request('/instructors'),
  getCalendar: (category?: string, type?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (type && type !== 'All') params.set('type', type);
    const qs = params.toString();
    return request(`/calendar${qs ? `?${qs}` : ''}`);
  },
  submitEnquiry: (data: { name: string; email: string; type: string; message: string }) =>
    request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  downloadSyllabus: (courseId: string, email: string) =>
    request('/syllabus-download', { method: 'POST', body: JSON.stringify({ courseId, email }) }),
  joinWaitlist: (courseId: string, email: string, scheduleInfo?: string) =>
    request('/waitlist', { method: 'POST', body: JSON.stringify({ courseId, email, scheduleInfo }) }),

  // Dashboard (protected)
  getDashboardStats: () => request('/dashboard/stats'),
  getDashboardEnquiries: () => request('/dashboard/enquiries'),
  getDashboardLeads: () => request('/dashboard/leads'),
  getDashboardWaitlist: () => request('/dashboard/waitlist'),

  // Courses CRUD (admin, protected)
  getAdminCourses: () => request('/courses/admin/all'),
  createCourse: (data: any) =>
    request('/courses/admin', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: string, data: any) =>
    request(`/courses/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: string) =>
    request(`/courses/admin/${id}`, { method: 'DELETE' }),
  togglePublishCourse: (id: string) =>
    request(`/courses/admin/${id}/publish`, { method: 'PATCH' }),
};

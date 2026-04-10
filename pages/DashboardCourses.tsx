import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Search,
  X, ChevronDown, AlertCircle, CheckCircle
} from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  program: string;
  level: string;
  duration: string;
  format: string;
  price: number;
  overview: string;
  isPublished: boolean;
  instructor: any;
  audience: string[];
  objectives: string[];
  prerequisites: string[];
}

const PROGRAMS = ['Business Continuity', 'Data Center', 'Cybersecurity'];
const LEVELS = ['Foundation', 'Continuing Education', 'Diploma', 'Advanced Diploma', 'Executive Diploma'];
const FORMATS = ['Classroom', 'Online Modular', 'Hybrid'];

const emptyForm = {
  code: '', title: '', program: 'Business Continuity', level: 'Foundation',
  duration: '', format: 'Classroom', price: 0, overview: '',
  instructorId: '', isPublished: true,
  audiences: '' as string, objectives: '' as string, prerequisites: '' as string,
};

const DashboardCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await api.getAdminCourses();
      setCourses(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  // Filter logic
  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchProgram = filterProgram === 'All' || c.program === filterProgram;
    const matchLevel = filterLevel === 'All' || c.level === filterLevel;
    return matchSearch && matchProgram && matchLevel;
  });

  // Group by program
  const grouped: Record<string, Course[]> = {};
  for (const c of filtered) {
    if (!grouped[c.program]) grouped[c.program] = [];
    grouped[c.program].push(c);
  }

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (c: Course) => {
    setEditingId(c.id);
    setForm({
      code: c.code, title: c.title, program: c.program, level: c.level,
      duration: c.duration, format: c.format, price: c.price, overview: c.overview,
      instructorId: c.instructor?.id || '', isPublished: c.isPublished,
      audiences: c.audience.join('\n'),
      objectives: c.objectives.join('\n'),
      prerequisites: c.prerequisites.join('\n'),
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.title || !form.duration) {
      setError('Code, title, and duration are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        code: form.code,
        title: form.title,
        program: form.program,
        level: form.level,
        duration: form.duration,
        format: form.format,
        price: form.price,
        overview: form.overview,
        instructorId: form.instructorId || null,
        isPublished: form.isPublished,
        audiences: form.audiences.split('\n').map(s => s.trim()).filter(Boolean),
        objectives: form.objectives.split('\n').map(s => s.trim()).filter(Boolean),
        prerequisites: form.prerequisites.split('\n').map(s => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await api.updateCourse(editingId, payload);
        setSuccessMsg('Course updated');
      } else {
        await api.createCourse(payload);
        setSuccessMsg('Course created');
      }
      setShowModal(false);
      fetchCourses();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleTogglePublish = async (id: string) => {
    await api.togglePublishCourse(id);
    fetchCourses();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteCourse(deleteId);
      setDeleteId(null);
      fetchCourses();
      setSuccessMsg('Course deleted');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch { /* ignore */ }
    setDeleting(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-mci-teal" /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-mci-navy">Courses Management</h2>
          <p className="text-sm text-gray-500">{courses.length} total courses</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-mci-navy text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-mci-teal transition-colors">
          <Plus size={18} /> Add Course
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text" placeholder="Search by title or code..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-4 text-sm focus:border-mci-teal focus:ring-1 focus:ring-mci-teal outline-none"
          />
        </div>
        <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)}
          className="border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:border-mci-teal outline-none">
          <option value="All">All Programs</option>
          {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          className="border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:border-mci-teal outline-none">
          <option value="All">All Levels</option>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Course List grouped by program */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">No courses found.</div>
      ) : (
        Object.entries(grouped).map(([program, programCourses]) => (
          <div key={program} className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{program} ({programCourses.length})</h3>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-2 p-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
                <div className="col-span-2">Code</div>
                <div className="col-span-4">Title</div>
                <div className="col-span-2">Level</div>
                <div className="col-span-1">Duration</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-100">
                {programCourses.map(c => (
                  <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 items-center hover:bg-gray-50 transition-colors text-sm">
                    <div className="col-span-2 font-mono text-xs text-mci-teal font-bold">{c.code}</div>
                    <div className="col-span-4 font-medium text-mci-navy truncate" title={c.title}>{c.title}</div>
                    <div className="col-span-2">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">{c.level}</span>
                    </div>
                    <div className="col-span-1 text-gray-600 text-xs">{c.duration}</div>
                    <div className="col-span-1">
                      {c.isPublished
                        ? <span className="text-green-600 text-xs font-bold flex items-center gap-1"><Eye size={12} /> Live</span>
                        : <span className="text-gray-400 text-xs font-bold flex items-center gap-1"><EyeOff size={12} /> Draft</span>
                      }
                    </div>
                    <div className="col-span-2 flex justify-end gap-1">
                      <button onClick={() => handleTogglePublish(c.id)} title={c.isPublished ? 'Unpublish' : 'Publish'}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors">
                        {c.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEdit(c)} title="Edit"
                        className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(c.id)} title="Delete"
                        className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-mci-navy mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone. All related schedules, reviews, and curriculum data will also be deleted.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center gap-2">
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-mci-navy">{editingId ? 'Edit Course' : 'Create New Course'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Code *</label>
                  <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                    placeholder="e.g. BCM-S1-001" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration *</label>
                  <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                    placeholder="e.g. 5 Days" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Program</label>
                  <select value={form.program} onChange={e => setForm({...form, program: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none">
                    {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Level</label>
                  <select value={form.level} onChange={e => setForm({...form, level: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none">
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Format</label>
                  <select value={form.format} onChange={e => setForm({...form, format: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none">
                    {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (USD)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-mci-teal focus:ring-mci-teal" />
                    <span className="text-sm font-medium text-gray-700">Published (visible on website)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Overview</label>
                <textarea value={form.overview} onChange={e => setForm({...form, overview: e.target.value})} rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Audience (one per line)</label>
                <textarea value={form.audiences} onChange={e => setForm({...form, audiences: e.target.value})} rows={3}
                  placeholder="Data center operators&#10;IT professionals&#10;Risk managers"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none font-mono text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Learning Objectives (one per line)</label>
                <textarea value={form.objectives} onChange={e => setForm({...form, objectives: e.target.value})} rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none font-mono text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prerequisites (one per line)</label>
                <textarea value={form.prerequisites} onChange={e => setForm({...form, prerequisites: e.target.value})} rows={2}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none font-mono text-xs" />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white bg-mci-navy hover:bg-mci-teal rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {editingId ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCourses;

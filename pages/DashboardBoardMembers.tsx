import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, AlertCircle, CheckCircle, User, Linkedin } from 'lucide-react';

interface BoardMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string | null;
  linkedinUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
}

const emptyForm = { name: '', position: '', bio: '', imageUrl: '', linkedinUrl: '' };

const DashboardBoardMembers = () => {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    try { setMembers(await api.getAdminBoardMembers()); } catch {}
    setLoading(false);
  };
  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (m: BoardMember) => {
    setEditingId(m.id);
    setForm({ name: m.name, position: m.position, bio: m.bio, imageUrl: m.imageUrl || '', linkedinUrl: m.linkedinUrl || '' });
    setError(''); setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.position) { setError('Name and position are required'); return; }
    setSaving(true); setError('');
    try {
      const payload = { name: form.name, position: form.position, bio: form.bio, imageUrl: form.imageUrl || null, linkedinUrl: form.linkedinUrl || null };
      if (editingId) { await api.updateBoardMember(editingId, payload); showSuccess('Board member updated'); }
      else { await api.createBoardMember(payload); showSuccess('Board member added'); }
      setShowModal(false); fetch();
    } catch (err: any) { setError(err.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleToggle = async (id: number) => { await api.toggleBoardMemberVisibility(id); fetch(); };
  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try { await api.deleteBoardMember(deleteId); setDeleteId(null); fetch(); showSuccess('Board member deleted'); } catch {}
    setDeleting(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-mci-teal" /></div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-mci-text">Board Members</h2>
          <p className="text-sm text-gray-500">{members.length} members · Displayed on About page when visible</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-mci-navy text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-mci-teal transition-colors">
          <Plus size={18} /> Add Member
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {members.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">No board members yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <div key={m.id} className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow ${m.isVisible ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'}`}>
              <div className="flex items-start gap-4 mb-3">
                {m.imageUrl ? (
                  <img src={m.imageUrl} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0"><User size={24} /></div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-mci-text text-sm truncate">{m.name}</h3>
                  <p className="text-xs text-mci-teal font-medium">{m.position}</p>
                  {m.linkedinUrl && (
                    <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 mt-1 hover:underline">
                      <Linkedin size={10} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
              {m.bio && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{m.bio}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {m.isVisible ? <span className="text-green-600 flex items-center gap-1"><Eye size={12} /> Visible</span> : <span className="flex items-center gap-1"><EyeOff size={12} /> Hidden</span>}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(m.id)} className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors">{m.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-mci-text mb-2">Delete Board Member?</h3>
            <p className="text-sm text-gray-600 mb-6">This will remove them from the website.</p>
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
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-8 relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-mci-text">{editingId ? 'Edit Board Member' : 'Add Board Member'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"><AlertCircle size={16} /> {error}</div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. John Doe" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Position *</label>
                <input type="text" value={form.position} onChange={e => setForm({...form, position: e.target.value})}
                  placeholder="e.g. Chairman, Advisory Board, Co-Founder" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Photo URL</label>
                <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
                  placeholder="https://example.com/photo.jpg" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
                {form.imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={form.imageUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" onError={e => (e.currentTarget.style.display='none')} />
                    <span className="text-xs text-gray-400">Preview</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">LinkedIn URL</label>
                <input type="text" value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})}
                  placeholder="https://linkedin.com/in/username" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4}
                  placeholder="Brief professional background..." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white bg-mci-navy hover:bg-mci-teal rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {editingId ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBoardMembers;

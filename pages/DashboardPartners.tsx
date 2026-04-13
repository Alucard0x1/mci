import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, AlertCircle, CheckCircle, GripVertical, ExternalLink } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
}

const emptyForm = { name: '', logoUrl: '', websiteUrl: '' };

const DashboardPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPartners = async () => {
    try { setClearSuccess(); setPartners(await api.getAdminPartners()); }
    catch { /* ignore */ }
    setLoading(false);
  };

  const setClearSuccess = () => {};
  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  useEffect(() => { fetchPartners(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setError(''); setShowModal(true); };

  const openEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({ name: p.name, logoUrl: p.logoUrl || '', websiteUrl: p.websiteUrl || '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) { setError('Name is required'); return; }
    setSaving(true); setError('');
    try {
      const payload = { name: form.name, logoUrl: form.logoUrl || null, websiteUrl: form.websiteUrl || null };
      if (editingId) { await api.updatePartner(editingId, payload); showSuccess('Partner updated'); }
      else { await api.createPartner(payload); showSuccess('Partner added'); }
      setShowModal(false); fetchPartners();
    } catch (err: any) { setError(err.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleToggleVisibility = async (id: number) => { await api.togglePartnerVisibility(id); fetchPartners(); };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await api.deletePartner(deleteId); setDeleteId(null); fetchPartners(); showSuccess('Partner deleted'); }
    catch { /* ignore */ }
    setDeleting(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-mci-teal" /></div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-mci-text">Partners Management</h2>
          <p className="text-sm text-gray-500">{partners.length} partners · Displayed in "Supported By" section on homepage</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-mci-navy text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-mci-teal transition-colors">
          <Plus size={18} /> Add Partner
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* Partner List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {partners.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No partners yet. Click "Add Partner" to get started.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {partners.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                {/* Logo preview */}
                <div className="w-24 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">{p.name}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-mci-text text-sm">{p.name}</div>
                  {p.websiteUrl && (
                    <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-mci-teal flex items-center gap-1 hover:underline">
                      {p.websiteUrl} <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  {p.isVisible
                    ? <span className="text-green-600 text-xs font-bold flex items-center gap-1"><Eye size={12} /> Visible</span>
                    : <span className="text-gray-400 text-xs font-bold flex items-center gap-1"><EyeOff size={12} /> Hidden</span>
                  }
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleToggleVisibility(p.id)} title={p.isVisible ? 'Hide' : 'Show'}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors">
                    {p.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => openEdit(p)} title="Edit"
                    className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(p.id)} title="Delete"
                    className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-mci-text mb-2">Delete Partner?</h3>
            <p className="text-sm text-gray-600 mb-6">This will remove the partner from the website.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-mci-text">{editingId ? 'Edit Partner' : 'Add Partner'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Partner Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Equinix" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logo URL</label>
                <input type="text" value={form.logoUrl} onChange={e => setForm({...form, logoUrl: e.target.value})}
                  placeholder="https://example.com/logo.png" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
                {form.logoUrl && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 flex items-center justify-center h-16">
                    <img src={form.logoUrl} alt="Preview" className="max-h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Website URL</label>
                <input type="text" value={form.websiteUrl} onChange={e => setForm({...form, websiteUrl: e.target.value})}
                  placeholder="https://example.com" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-mci-teal outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white bg-mci-navy hover:bg-mci-teal rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {editingId ? 'Save Changes' : 'Add Partner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPartners;

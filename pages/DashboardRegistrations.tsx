import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loader2, CheckCircle, Clock, XCircle, CreditCard, Banknote, Building2, Search, Eye } from 'lucide-react';

interface Registration {
  id: string;
  registrationNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  fullName: string;
  email: string;
  company: string;
  courseTitle: string;
  courseCode: string;
  total: number;
  createdAt: string;
  paidAt: string | null;
}

const DashboardRegistrations = () => {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchRegs = async () => {
    try { setRegs(await api.getAdminRegistrations()); } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchRegs(); }, []);

  const filtered = regs.filter(r => {
    const matchSearch = !search || r.fullName.toLowerCase().includes(search.toLowerCase()) || r.registrationNumber.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleMarkPaid = async (id: string) => {
    setUpdating(true);
    try { await api.updateRegistrationStatus(id, { paymentStatus: 'paid' }); fetchRegs(); setSelectedReg(null); } catch {}
    setUpdating(false);
  };

  const handleCancel = async (id: string) => {
    setUpdating(true);
    try { await api.updateRegistrationStatus(id, { status: 'cancelled' }); fetchRegs(); setSelectedReg(null); } catch {}
    setUpdating(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs font-bold"><CheckCircle size={10} /> Confirmed</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded text-xs font-bold"><XCircle size={10} /> Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold"><Clock size={10} /> Pending</span>;
    }
  };

  const paymentIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard size={12} />;
      case 'bank_transfer': return <Banknote size={12} />;
      case 'invoice': return <Building2 size={12} />;
      default: return null;
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-mci-teal" /></div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-mci-text">Registrations</h2>
          <p className="text-sm text-gray-500">{regs.length} total · {regs.filter(r => r.status === 'confirmed').length} confirmed · {regs.filter(r => r.status === 'pending_payment').length} pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder="Search by name, email, or registration number..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2.5 pl-9 pr-4 text-sm focus:border-mci-teal outline-none" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:border-mci-teal outline-none">
          <option value="All">All Status</option>
          <option value="pending_payment">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No registrations found.</div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-2 p-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
              <div className="col-span-2">Reg No.</div>
              <div className="col-span-2">Participant</div>
              <div className="col-span-3">Course</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1">Payment</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            <div className="divide-y divide-gray-100">
              {filtered.map(r => (
                <div key={r.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 items-center hover:bg-gray-50 transition-colors text-sm">
                  <div className="col-span-2 font-mono text-xs text-mci-teal font-bold">{r.registrationNumber}</div>
                  <div className="col-span-2">
                    <div className="font-medium text-mci-text truncate">{r.fullName}</div>
                    <div className="text-xs text-gray-400 truncate">{r.email}</div>
                  </div>
                  <div className="col-span-3">
                    <div className="text-xs text-gray-600 truncate">{r.courseCode} — {r.courseTitle}</div>
                  </div>
                  <div className="col-span-1 font-medium">USD {r.total.toFixed(0)}</div>
                  <div className="col-span-1 flex items-center gap-1 text-xs text-gray-500">
                    {paymentIcon(r.paymentMethod)}
                    <span className="capitalize">{r.paymentMethod.replace('_', ' ')}</span>
                  </div>
                  <div className="col-span-1">{statusBadge(r.status)}</div>
                  <div className="col-span-1 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                  <div className="col-span-1 text-right">
                    <button onClick={() => setSelectedReg(r)} className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition-colors"><Eye size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-8 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-mci-text">{selectedReg.registrationNumber}</h3>
                <div className="mt-1">{statusBadge(selectedReg.status)}</div>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-gray-500">Name</div><div className="font-medium">{selectedReg.fullName}</div>
                <div className="text-gray-500">Email</div><div>{selectedReg.email}</div>
                {selectedReg.company && <><div className="text-gray-500">Company</div><div>{selectedReg.company}</div></>}
                <div className="text-gray-500">Course</div><div>{selectedReg.courseCode} — {selectedReg.courseTitle}</div>
                <div className="text-gray-500">Total</div><div className="font-bold">USD {selectedReg.total.toFixed(2)}</div>
                <div className="text-gray-500">Payment</div><div className="capitalize">{selectedReg.paymentMethod.replace('_', ' ')} · {selectedReg.paymentStatus}</div>
                <div className="text-gray-500">Registered</div><div>{new Date(selectedReg.createdAt).toLocaleString()}</div>
                {selectedReg.paidAt && <><div className="text-gray-500">Paid</div><div>{new Date(selectedReg.paidAt).toLocaleString()}</div></>}
              </div>
            </div>

            {selectedReg.status !== 'cancelled' && (
              <div className="flex gap-3 border-t border-gray-200 pt-4">
                {selectedReg.paymentStatus !== 'paid' && (
                  <button onClick={() => handleMarkPaid(selectedReg.id)} disabled={updating}
                    className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {updating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Mark as Paid
                  </button>
                )}
                <button onClick={() => handleCancel(selectedReg.id)} disabled={updating}
                  className="px-4 py-2.5 border border-red-300 text-red-600 font-medium rounded-lg text-sm hover:bg-red-50 disabled:opacity-50">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRegistrations;

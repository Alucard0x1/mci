import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Loader2, CheckCircle, AlertCircle, ChevronRight, Calendar, MapPin, Clock, CreditCard, Building2, Banknote, Tag } from 'lucide-react';

type Step = 'form' | 'review' | 'processing';

const COUNTRIES = ['Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Philippines', 'Vietnam', 'India', 'Australia', 'United Kingdom', 'United States', 'United Arab Emirates', 'Saudi Arabia', 'Other'];

const Register = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');

  // Form
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', company: '', jobTitle: '', country: 'Singapore', poNumber: '',
    paymentMethod: 'card' as 'card' | 'bank_transfer' | 'invoice',
  });

  // Promo
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Processing
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    api.getCourse(courseId).then(setCourse).catch(() => setError('Course not found')).finally(() => setLoading(false));
  }, [courseId]);

  const availableSchedules = course?.schedules?.filter((s: any) => s.status !== 'Sold Out') || [];

  // Pricing
  const subtotal = course?.price || 0;
  let discount = 0;
  if (promoResult) {
    discount = promoResult.discountType === 'percentage' ? subtotal * (promoResult.discountValue / 100) : Math.min(promoResult.discountValue, subtotal);
  }
  const total = Math.max(0, subtotal - discount);

  const handleValidatePromo = async () => {
    if (!promoCode) return;
    setPromoLoading(true); setPromoError(''); setPromoResult(null);
    try {
      const result = await api.validatePromo(promoCode, courseId!);
      setPromoResult(result);
    } catch (err: any) { setPromoError(err.message); }
    setPromoLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email) { setError('Full name and email are required'); return; }
    setSubmitting(true); setError('');
    try {
      const reg = await api.createRegistration({
        courseId, scheduleId: selectedSchedule || null,
        fullName: form.fullName, email: form.email, phone: form.phone,
        company: form.company, jobTitle: form.jobTitle, country: form.country,
        poNumber: form.poNumber, paymentMethod: form.paymentMethod,
        promoCode: promoResult ? promoCode : null,
      });

      const checkout = await api.checkoutRegistration(reg.id);

      if (form.paymentMethod === 'card' && checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      } else {
        navigate(`/register/confirmation/${reg.id}`);
      }
    } catch (err: any) { setError(err.message || 'Registration failed'); setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={40} className="animate-spin text-mci-teal" /></div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center text-gray-500">Course not found</div>;

  const selectedSched = course.schedules?.find((s: any) => s.id === selectedSchedule);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-mci-maroon text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-white">Home</Link> / <Link to={`/courses/${course.id}`} className="hover:text-white">{course.code}</Link> / <span className="text-white">Register</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2">Register for {course.title}</h1>
          <p className="text-white/80">{course.code} · {course.duration} · {course.format}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-10">
          {['Details', 'Review & Pay'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                (i === 0 && step === 'form') || (i === 1 && step === 'review') ? 'bg-mci-maroon text-white' : 
                (i === 0 && step === 'review') ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{i === 0 && step === 'review' ? '✓' : i + 1}</div>
              <span className={`text-sm font-medium ${(i === 0 && step === 'form') || (i === 1 && step === 'review') ? 'text-mci-text' : 'text-gray-400'}`}>{label}</span>
              {i < 1 && <ChevronRight size={16} className="text-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form / review */}
          <div className="lg:col-span-2">
            {step === 'form' && (
              <div className="space-y-8">
                {/* Schedule Selection */}
                {availableSchedules.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-mci-text mb-4">Select Session</h3>
                    <div className="space-y-3">
                      {availableSchedules.map((s: any) => (
                        <label key={s.id} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedSchedule === s.id ? 'border-mci-maroon bg-mci-maroon/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input type="radio" name="schedule" value={s.id} checked={selectedSchedule === s.id}
                            onChange={() => setSelectedSchedule(s.id)} className="w-4 h-4 text-mci-maroon" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="font-medium text-mci-text text-sm">{new Date(s.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              {s.status === 'Guaranteed' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">GTR</span>}
                              {s.status === 'Limited' && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">Limited</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {s.location}</span>
                              <span>{s.type}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Participant Details */}
                <div>
                  <h3 className="text-lg font-bold text-mci-text mb-4">Participant Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                      <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-mci-teal outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-mci-teal outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-mci-teal outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company / Organisation</label>
                      <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-mci-teal outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                      <input type="text" value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-mci-teal outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
                      <select value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-mci-teal outline-none">
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PO Number <span className="text-gray-400 normal-case">(corporate only)</span></label>
                      <input type="text" value={form.poNumber} onChange={e => setForm({...form, poNumber: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-mci-teal outline-none" />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-bold text-mci-text mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'card', label: 'Credit / Debit Card', desc: 'Pay securely via Stripe', icon: CreditCard },
                      { value: 'bank_transfer', label: 'Bank Transfer', desc: 'Wire transfer — details sent via email', icon: Banknote },
                      { value: 'invoice', label: 'Corporate Invoice', desc: 'Net 30 terms — PO required', icon: Building2 },
                    ].map(method => (
                      <label key={method.value} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                        form.paymentMethod === method.value ? 'border-mci-maroon bg-mci-maroon/5' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input type="radio" name="payment" value={method.value} checked={form.paymentMethod === method.value}
                          onChange={() => setForm({...form, paymentMethod: method.value as any})} className="w-4 h-4 text-mci-maroon" />
                        <method.icon size={20} className="text-gray-400" />
                        <div>
                          <div className="font-medium text-mci-text text-sm">{method.label}</div>
                          <div className="text-xs text-gray-500">{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => { if (!form.fullName || !form.email) { setError('Full name and email are required'); return; } setError(''); setStep('review'); }}
                  className="w-full bg-mci-maroon text-white font-bold py-3.5 rounded-lg hover:brightness-110 transition-all">
                  Continue to Review
                </button>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-mci-text">Review Your Registration</h3>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="text-gray-500">Name</div><div className="font-medium">{form.fullName}</div>
                    <div className="text-gray-500">Email</div><div className="font-medium">{form.email}</div>
                    {form.phone && <><div className="text-gray-500">Phone</div><div>{form.phone}</div></>}
                    {form.company && <><div className="text-gray-500">Company</div><div>{form.company}</div></>}
                    {form.jobTitle && <><div className="text-gray-500">Job Title</div><div>{form.jobTitle}</div></>}
                    <div className="text-gray-500">Country</div><div>{form.country}</div>
                    {form.poNumber && <><div className="text-gray-500">PO Number</div><div>{form.poNumber}</div></>}
                  </div>
                </div>

                {selectedSched && (
                  <div className="bg-gray-50 rounded-lg p-6 text-sm">
                    <div className="font-bold text-mci-text mb-2">Selected Session</div>
                    <div className="text-gray-600">{new Date(selectedSched.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {selectedSched.location} · {selectedSched.type}</div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6 text-sm">
                  <div className="font-bold text-mci-text mb-2">Payment</div>
                  <div className="text-gray-600 capitalize">{form.paymentMethod.replace('_', ' ')}</div>
                </div>

                {/* Promo Code */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Promo code" className="w-full border border-gray-300 rounded-lg py-3 pl-9 pr-4 text-sm focus:border-mci-teal outline-none" />
                    </div>
                    <button onClick={handleValidatePromo} disabled={promoLoading || !promoCode}
                      className="px-4 py-2 bg-gray-100 text-mci-text font-medium text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50">
                      {promoLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {promoResult && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><CheckCircle size={12} /> Discount applied: {promoResult.discountType === 'percentage' ? `${promoResult.discountValue}%` : `USD ${promoResult.discountValue}`}</p>}
                  {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
                </div>

                {/* Policy agreement */}
                <div className="text-xs text-gray-500">
                  By proceeding, you agree to our <Link to="/policy" className="text-mci-maroon underline" target="_blank">Registration & Student Policies</Link> including cancellation and refund terms.
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('form')} className="px-6 py-3.5 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50">
                    Back
                  </button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 bg-mci-maroon text-white font-bold py-3.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> :
                      form.paymentMethod === 'card' ? `Pay USD ${total.toFixed(2)}` : 'Submit Registration'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-28">
              <h3 className="font-bold text-mci-text mb-4">Order Summary</h3>
              <div className="text-sm space-y-3 mb-6">
                <div className="font-medium text-mci-text">{course.code}</div>
                <div className="text-gray-600">{course.title}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} /> {course.duration} · {course.format}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>USD {subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-USD {discount.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-mci-text text-lg pt-2 border-t border-gray-200">
                  <span>Total</span><span>USD {total.toFixed(2)}</span>
                </div>
              </div>
              {subtotal === 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                  Price not yet set for this course. Please contact admissions for pricing.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

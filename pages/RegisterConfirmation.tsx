import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Loader2, CheckCircle, Clock, AlertCircle, Mail, FileText, ArrowRight } from 'lucide-react';

const RegisterConfirmation = () => {
  const { registrationId } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const [reg, setReg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!registrationId) return;
    api.getRegistration(registrationId).then(setReg).catch(() => {}).finally(() => setLoading(false));
  }, [registrationId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={40} className="animate-spin text-mci-teal" /></div>;
  if (!reg) return <div className="min-h-screen flex items-center justify-center text-gray-500">Registration not found</div>;

  const isPaid = reg.paymentStatus === 'paid';
  const isCancelled = status === 'cancelled';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          {isCancelled ? (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-amber-600" />
              </div>
              <h1 className="text-3xl font-bold text-mci-text mb-3">Payment Cancelled</h1>
              <p className="text-gray-600">Your payment was not completed. Your registration is still pending.</p>
            </>
          ) : isPaid ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-mci-text mb-3">Registration Confirmed</h1>
              <p className="text-gray-600">Your payment has been received. You're all set.</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-mci-text mb-3">Registration Received</h1>
              <p className="text-gray-600">Please complete payment to confirm your seat.</p>
            </>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-gray-500">Registration No.</div>
            <div className="font-bold text-mci-text">{reg.registrationNumber}</div>

            <div className="text-gray-500">Status</div>
            <div>
              {isPaid ? (
                <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs font-bold"><CheckCircle size={12} /> Confirmed</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold"><Clock size={12} /> Pending Payment</span>
              )}
            </div>

            <div className="text-gray-500">Course</div>
            <div className="font-medium">{reg.courseTitle} ({reg.courseCode})</div>

            {reg.scheduleDate && (
              <>
                <div className="text-gray-500">Date</div>
                <div>{reg.scheduleDate}</div>
              </>
            )}
            {reg.scheduleLocation && (
              <>
                <div className="text-gray-500">Location</div>
                <div>{reg.scheduleLocation} · {reg.scheduleType}</div>
              </>
            )}

            <div className="text-gray-500">Participant</div>
            <div>{reg.fullName}</div>

            <div className="text-gray-500">Email</div>
            <div>{reg.email}</div>

            <div className="col-span-2 border-t border-gray-200 pt-4 mt-2"></div>

            <div className="text-gray-500">Total</div>
            <div className="font-bold text-lg text-mci-text">USD {reg.total.toFixed(2)}</div>

            <div className="text-gray-500">Payment Method</div>
            <div className="capitalize">{reg.paymentMethod.replace('_', ' ')}</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-mci-text mb-4 flex items-center gap-2"><FileText size={18} /> What's Next</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <Mail size={16} className="text-mci-teal mt-0.5 flex-shrink-0" />
              <span>A confirmation email has been sent to <strong>{reg.email}</strong> with your registration details.</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="text-mci-teal mt-0.5 flex-shrink-0" />
              <span>Joining instructions will be sent 48 hours before the program start date.</span>
            </li>
            {!isPaid && reg.paymentMethod === 'bank_transfer' && (
              <li className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Please complete your bank transfer within 7 business days. Payment details have been sent to your email.</span>
              </li>
            )}
            {!isPaid && reg.paymentMethod === 'invoice' && (
              <li className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <span>A corporate invoice will be sent to your billing contact. Net 30 payment terms apply.</span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            Back to Homepage
          </Link>
          <Link to="/programs/data-center" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-mci-maroon text-white rounded-lg text-sm font-bold hover:brightness-110">
            Explore More Programs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmation;

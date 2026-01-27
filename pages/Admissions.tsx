import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, FileCheck, Users, CreditCard } from 'lucide-react';

const Admissions = () => {
  return (
    <div className="bg-white pb-20">
      <div className="bg-mci-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admissions & FAQ</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Everything you need to know about enrolling in our professional programs.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-mci-lightGrey rounded-full text-mci-navy">
              <FileCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-mci-navy">How to Apply</h2>
          </div>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">Enrolling in MCI courses is a straightforward process designed for working professionals.</p>
            <ol className="list-decimal pl-5 space-y-3">
              <li><strong>Select your Course:</strong> Navigate to the course page and review the prerequisites.</li>
              <li><strong>Choose a Schedule:</strong> Click "Select" on your preferred date (Virtual or Classroom).</li>
              <li><strong>Complete Registration:</strong> Fill in the delegate details form.</li>
              <li><strong>Payment:</strong> You can pay immediately via credit card or request an invoice (Corporate only).</li>
              <li><strong>Confirmation:</strong> You will receive a booking confirmation and joining instructions immediately.</li>
            </ol>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-mci-lightGrey rounded-full text-mci-navy">
              <Users size={24} />
            </div>
            <h2 className="text-2xl font-bold text-mci-navy">Corporate & Group Booking</h2>
          </div>
          <div className="prose max-w-none text-gray-600">
             <p className="mb-4">For teams of 5 or more, we offer customized pricing and dedicated sessions.</p>
             <p>To book a private session:</p>
             <ul className="list-disc pl-5 space-y-2">
               <li>Submit a <Link to="/contact?type=corporate" className="text-mci-teal font-bold underline">Corporate Enquiry</Link>.</li>
               <li>Our training advisor will contact you within 24 hours to discuss learning objectives.</li>
               <li>We can deliver training at your premises, at our center, or virtually.</li>
             </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-mci-lightGrey rounded-full text-mci-navy">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-mci-navy">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <details className="group p-4 border border-gray-200 rounded-lg open:bg-gray-50 transition-colors">
              <summary className="font-bold text-mci-navy cursor-pointer list-none flex justify-between items-center">
                Do I receive a certificate upon completion?
                <span className="text-mci-teal font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-3 text-gray-600 text-sm">
                Yes. All participants receive a Certificate of Attendance. For examined courses (e.g., CDCP, ISO 22301), you will receive a Professional Certification upon passing the exam.
              </div>
            </details>

            <details className="group p-4 border border-gray-200 rounded-lg open:bg-gray-50 transition-colors">
              <summary className="font-bold text-mci-navy cursor-pointer list-none flex justify-between items-center">
                What happens if I need to cancel?
                <span className="text-mci-teal font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-3 text-gray-600 text-sm">
                Cancellations made more than 14 days before the start date are eligible for a full refund or transfer. Cancellations within 14 days may incur a fee. Please read our full Terms of Service.
              </div>
            </details>

            <details className="group p-4 border border-gray-200 rounded-lg open:bg-gray-50 transition-colors">
              <summary className="font-bold text-mci-navy cursor-pointer list-none flex justify-between items-center">
                Are virtual classes live?
                <span className="text-mci-teal font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-3 text-gray-600 text-sm">
                Yes, our "Virtual" classes are Instructor-Led Training (V-ILT) conducted live via Zoom/Teams. You can interact with the instructor and other delegates in real-time.
              </div>
            </details>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Admissions;
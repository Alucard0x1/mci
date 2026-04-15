import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CreditCard, RefreshCw, ShieldCheck, Clock, AlertTriangle, BookOpen, Users, Globe, Mail } from 'lucide-react';

const Policy = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-mci-maroon text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-4 block">Policies</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Registration & Student Policies</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know before, during, and after your learning journey with Mission Critical Institute.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Table of Contents */}
        <div className="bg-mci-lightGrey rounded-xl p-6 mb-12 border border-gray-200">
          <h2 className="font-bold text-mci-text text-sm uppercase tracking-widest mb-4">On This Page</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              { href: '#registration', label: 'Registration & Enrolment' },
              { href: '#payment', label: 'Payment Terms' },
              { href: '#cancellation', label: 'Cancellation & Refund' },
              { href: '#transfer', label: 'Transfer & Deferral' },
              { href: '#attendance', label: 'Attendance & Participation' },
              { href: '#certification', label: 'Certification & Assessment' },
              { href: '#conduct', label: 'Code of Conduct' },
              { href: '#ip', label: 'Intellectual Property' },
              { href: '#privacy', label: 'Data Privacy' },
              { href: '#contact', label: 'Contact & Disputes' },
            ].map(item => (
              <a key={item.href} href={item.href} className="text-mci-maroon hover:text-mci-amber transition-colors font-medium py-1">
                → {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* 1. Registration */}
        <section id="registration" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><FileText size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">1. Registration & Enrolment</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>All registrations are processed on a first-come, first-served basis. A confirmed seat is only guaranteed upon receipt of full payment or an approved purchase order from a corporate sponsor.</p>
            <h3 className="text-lg font-bold text-mci-text mt-6">Eligibility</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Participants must meet the stated prerequisites for each program. The Institute reserves the right to verify qualifications prior to enrolment.</li>
              <li>Foundation-level programs are open to all professionals. Diploma and Advanced Diploma programs may require prior completion of prerequisite courses.</li>
              <li>Corporate group bookings (5 or more delegates) should be arranged through our Corporate Services team.</li>
            </ul>
            <h3 className="text-lg font-bold text-mci-text mt-6">Registration Process</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select your desired program and session date on the website.</li>
              <li>Complete the online registration form with accurate personal and professional details.</li>
              <li>Submit payment or provide a valid corporate purchase order.</li>
              <li>Receive a confirmation email with joining instructions within 2 business days.</li>
              <li>For virtual sessions, access credentials will be sent 48 hours before the start date.</li>
            </ol>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-800"><strong>Note:</strong> The Institute reserves the right to cancel or reschedule a session due to insufficient enrolment, instructor availability, or unforeseen circumstances. In such cases, registered participants will be offered a full refund or transfer to the next available session.</p>
            </div>
          </div>
        </section>

        {/* 2. Payment */}
        <section id="payment" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><CreditCard size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">2. Payment Terms</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Full payment is required to confirm your registration unless a corporate invoice arrangement has been approved in advance.</p>
            <h3 className="text-lg font-bold text-mci-text mt-6">Accepted Methods</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Credit/Debit Card</strong> — Visa, Mastercard, and American Express via our secure payment gateway.</li>
              <li><strong>Bank Transfer</strong> — Wire transfer to our designated account. Payment must be received at least 7 business days before the program start date.</li>
              <li><strong>Corporate Invoice</strong> — Available for approved corporate accounts. Net 30 payment terms apply. A valid purchase order is required at the time of registration.</li>
            </ul>
            <h3 className="text-lg font-bold text-mci-text mt-6">Pricing</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>All prices are quoted in USD unless otherwise stated.</li>
              <li>Prices are exclusive of applicable taxes (GST/VAT) unless explicitly noted.</li>
              <li>The Institute reserves the right to adjust pricing. Registered participants will not be affected by price changes after confirmation.</li>
              <li>Early bird discounts and group rates are available for selected programs. Contact our admissions team for details.</li>
            </ul>
          </div>
        </section>

        {/* 3. Cancellation & Refund */}
        <section id="cancellation" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><RefreshCw size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">3. Cancellation & Refund Policy</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>We understand that plans may change. The following cancellation terms apply to all individual and corporate registrations:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-bold text-mci-text border-b">Notice Period</th>
                    <th className="text-left p-3 font-bold text-mci-text border-b">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">More than 30 days before start date</td>
                    <td className="p-3 text-green-700 font-medium">Full refund (100%)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">15–30 days before start date</td>
                    <td className="p-3 text-amber-700 font-medium">75% refund</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">7–14 days before start date</td>
                    <td className="p-3 text-amber-700 font-medium">50% refund</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">Less than 7 days before start date</td>
                    <td className="p-3 text-red-700 font-medium">No refund</td>
                  </tr>
                  <tr>
                    <td className="p-3">No-show / after program starts</td>
                    <td className="p-3 text-red-700 font-medium">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm">All cancellation requests must be submitted in writing to <strong>admissions@missioncritical.institute</strong>. The date of receipt of the written notice determines the applicable refund tier.</p>
            <p className="text-sm">Substitution of a delegate is permitted at no additional cost up to 48 hours before the program start date, provided the substitute meets the program prerequisites.</p>
          </div>
        </section>

        {/* 4. Transfer & Deferral */}
        <section id="transfer" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><Clock size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">4. Transfer & Deferral</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>Participants may request a one-time transfer to a future session of the same program at no additional charge, provided the request is made at least 14 days before the original start date.</li>
              <li>Transfers are subject to seat availability in the requested session.</li>
              <li>A second transfer request will incur an administrative fee of USD 150.</li>
              <li>Deferrals must be used within 12 months of the original program date. After 12 months, the registration is forfeited.</li>
              <li>Transfers between different programs (e.g., from BCM to Cybersecurity) are not permitted. A new registration is required.</li>
            </ul>
          </div>
        </section>

        {/* 5. Attendance */}
        <section id="attendance" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><Users size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">5. Attendance & Participation</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Active participation is essential to the learning experience at Mission Critical Institute. Our programs are designed around hands-on exercises, group discussions, and real-world simulations that require full engagement.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Minimum attendance of 90%</strong> is required to be eligible for certification and assessment.</li>
              <li>Participants who miss more than 10% of the program hours may be required to repeat the missed modules at an additional cost.</li>
              <li>For virtual (online) sessions, participants must have their cameras on during interactive segments and be present for the full scheduled duration.</li>
              <li>Punctuality is expected. Repeated late arrivals may be recorded as partial absences.</li>
              <li>The Institute reserves the right to remove a participant who is disruptive or fails to meet attendance requirements, without refund.</li>
            </ul>
          </div>
        </section>

        {/* 6. Certification */}
        <section id="certification" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><BookOpen size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">6. Certification & Assessment</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <h3 className="text-lg font-bold text-mci-text mt-6">Certificate of Attendance</h3>
            <p>All participants who meet the minimum attendance requirement will receive a Certificate of Attendance upon completion of the program.</p>
            <h3 className="text-lg font-bold text-mci-text mt-6">Professional Certification</h3>
            <p>For examined programs (Foundation, Diploma, Advanced Diploma, Executive Diploma), participants must pass the designated assessment to receive the professional certification.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Assessments may include written examinations, practical exercises, case study presentations, or a combination thereof.</li>
              <li>A minimum passing score of 70% is required unless otherwise stated in the program syllabus.</li>
              <li>Participants who do not pass the assessment on the first attempt are entitled to one free re-sit within 6 months of the original program date.</li>
              <li>Additional re-sit attempts will incur a fee of USD 200 per attempt.</li>
              <li>Certificates are issued digitally within 14 business days of successful completion. Physical certificates are available upon request for an additional fee.</li>
            </ul>
            <h3 className="text-lg font-bold text-mci-text mt-6">Continuing Professional Development (CPD)</h3>
            <p>All MCI programs carry CPD credit hours. The specific CPD value is stated on each program page. Participants are responsible for submitting CPD claims to their respective professional bodies.</p>
          </div>
        </section>

        {/* 7. Code of Conduct */}
        <section id="conduct" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><ShieldCheck size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">7. Code of Conduct</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Mission Critical Institute is committed to providing a professional, respectful, and inclusive learning environment. All participants, instructors, and staff are expected to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Treat all individuals with dignity and respect, regardless of background, nationality, gender, or experience level.</li>
              <li>Engage constructively in discussions and group activities.</li>
              <li>Refrain from any form of harassment, discrimination, or disruptive behaviour.</li>
              <li>Respect the confidentiality of case studies, proprietary information, and fellow participants' contributions.</li>
              <li>Comply with all facility rules and safety procedures during in-person sessions.</li>
              <li>Not engage in academic dishonesty, including plagiarism, cheating, or unauthorized sharing of assessment materials.</li>
            </ul>
            <p>Violations of this code may result in removal from the program without refund and may affect eligibility for future enrolment.</p>
          </div>
        </section>

        {/* 8. Intellectual Property */}
        <section id="ip" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><AlertTriangle size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">8. Intellectual Property</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>All course materials, including slides, handouts, workbooks, lab guides, and digital content, are the intellectual property of Mission Critical Institute and its content partners.</li>
              <li>Materials are provided for personal educational use only and may not be reproduced, distributed, or shared without prior written consent.</li>
              <li>Recording of sessions (audio, video, or screen capture) is strictly prohibited unless explicitly authorized by the instructor.</li>
              <li>Participants retain ownership of any original work produced during assessments or projects, but grant MCI a non-exclusive license to use anonymized excerpts for educational and promotional purposes.</li>
            </ul>
          </div>
        </section>

        {/* 9. Data Privacy */}
        <section id="privacy" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><Globe size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">9. Data Privacy & Protection</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Mission Critical Institute is committed to protecting the personal data of all participants in accordance with applicable data protection regulations, including the Singapore Personal Data Protection Act (PDPA) and GDPR where applicable.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Data collected:</strong> Name, email, phone number, employer, job title, and payment information necessary for registration and program delivery.</li>
              <li><strong>Purpose:</strong> Data is used solely for enrolment processing, program delivery, certification issuance, and communication regarding your learning journey.</li>
              <li><strong>Third parties:</strong> We do not sell or share personal data with third parties for marketing purposes. Data may be shared with certification bodies for the purpose of issuing professional credentials.</li>
              <li><strong>Retention:</strong> Personal data is retained for 7 years after the last interaction for certification verification and regulatory compliance purposes.</li>
              <li><strong>Rights:</strong> Participants may request access to, correction of, or deletion of their personal data by contacting our Data Protection Officer at <strong>privacy@missioncritical.institute</strong>.</li>
            </ul>
          </div>
        </section>

        {/* 10. Contact & Disputes */}
        <section id="contact" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-mci-maroon/10 rounded-lg text-mci-maroon"><Mail size={24} /></div>
            <h2 className="text-2xl font-bold text-mci-text">10. Contact & Dispute Resolution</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>For any questions, concerns, or disputes regarding these policies, please contact us:</p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div><strong>General Enquiries:</strong> admissions@missioncritical.institute</div>
              <div><strong>Billing & Refunds:</strong> finance@missioncritical.institute</div>
              <div><strong>Data Privacy:</strong> privacy@missioncritical.institute</div>
              <div><strong>Complaints & Disputes:</strong> compliance@missioncritical.institute</div>
            </div>
            <p>We aim to acknowledge all enquiries within 2 business days and resolve disputes within 14 business days. If a resolution cannot be reached, the matter may be referred to mediation in accordance with the laws of Singapore.</p>
          </div>
        </section>

        {/* Last Updated */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">These policies were last updated in April 2026.</p>
          <p className="text-sm text-gray-400 mt-2">
            Questions? <Link to="/contact" className="text-mci-maroon font-medium hover:underline">Contact our admissions team</Link>.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Policy;

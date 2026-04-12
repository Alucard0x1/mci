import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Handshake, TrendingUp, Users, CheckCircle, PieChart, Download } from 'lucide-react';

const Corporate = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-mci-maroon text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-4 block">Enterprise Solutions</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Strategic Workforce Development & Partnerships
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Scalable training solutions for organizations and authorized training partners.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link to="/contact?type=corporate" className="bg-mci-amber text-white font-bold px-8 py-3 rounded hover:brightness-110 transition-colors">
                 Request Team Quote
               </Link>
               <Link to="/contact?type=partnership" className="bg-transparent border border-white text-white font-bold px-8 py-3 rounded hover:bg-white hover:text-mci-text transition-colors">
                 Become a Partner
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Training Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center mb-20">
            <div className="flex-1">
               <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-mci-text rounded-lg mb-6">
                 <Building2 size={32} />
               </div>
               <h2 className="text-3xl font-bold text-mci-text mb-6">Corporate Training Solutions</h2>
               <p className="text-gray-600 text-lg mb-6">
                 Upskill your technical teams with consistent, accredited methodology. We offer flexible delivery formats tailored to your operational requirements.
               </p>
               <ul className="space-y-4">
                 {[
                   'Private sessions for teams of 5-100+',
                   'Customized case studies relevant to your sector',
                   'Post-training impact reports and skills gap analysis',
                   'Volume discounts and annual training credits'
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <CheckCircle size={20} className="text-mci-teal mt-1 flex-shrink-0" />
                     <span className="text-mci-text font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
            <div className="flex-1 bg-gray-100 rounded-2xl p-8 border border-gray-200">
               <h3 className="font-bold text-mci-text text-xl mb-6">Delivery Formats</h3>
               <div className="space-y-6">
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-bold text-mci-teal mb-2">On-Site / In-House</h4>
                    <p className="text-sm text-gray-600">We fly our expert instructors to your headquarters anywhere in the world. Ideal for secure environments.</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-bold text-mci-teal mb-2">Dedicated Virtual Class</h4>
                    <p className="text-sm text-gray-600">Private live-streamed sessions for distributed global teams, optimized for different time zones.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reseller & Partnership Section */}
      <section className="py-20 bg-mci-lightGrey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mci-text mb-4">Partner Ecosystem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join our network of Authorized Training Partners (ATPs) and Resellers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
               <Handshake size={40} className="text-mci-text mb-6" />
               <h3 className="text-xl font-bold text-mci-text mb-4">Commercial Resellers</h3>
               <p className="text-gray-600 text-sm mb-6">
                 Add our accredited courses to your portfolio. We provide white-label options and generous commission structures.
               </p>
               <ul className="text-sm space-y-2 text-gray-500 mb-6">
                 <li>• Wholesaler rates</li>
                 <li>• Instant booking API</li>
                 <li>• Account manager support</li>
               </ul>
             </div>

             <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
               <Users size={40} className="text-mci-text mb-6" />
               <h3 className="text-xl font-bold text-mci-text mb-4">Academic Partners</h3>
               <p className="text-gray-600 text-sm mb-6">
                 Universities and colleges can integrate our curriculum to offer professional certifications alongside degrees.
               </p>
               <ul className="text-sm space-y-2 text-gray-500 mb-6">
                 <li>• Curriculum licensing</li>
                 <li>• Train-the-Trainer programs</li>
                 <li>• Student discounts</li>
               </ul>
             </div>

             <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
               <TrendingUp size={40} className="text-mci-text mb-6" />
               <h3 className="text-xl font-bold text-mci-text mb-4">Marketing Support</h3>
               <p className="text-gray-600 text-sm mb-6">
                 We equip our partners with the tools they need to succeed in their local markets.
               </p>
               <ul className="text-sm space-y-2 text-gray-500 mb-6">
                 <li>• Co-branded brochures</li>
                 <li>• Email campaign templates</li>
                 <li>• Lead sharing program</li>
               </ul>
             </div>
          </div>

          <div className="mt-12 text-center">
             <Link to="/contact?type=partnership" className="text-mci-text font-bold border-b-2 border-mci-teal pb-1 hover:text-mci-teal transition-colors">
               Apply to become a Partner &rarr;
             </Link>
          </div>
        </div>
      </section>

      {/* Stats / Confidence */}
      <section className="py-20 bg-mci-maroon text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="p-4">
                <div className="text-4xl font-bold text-mci-amber mb-2">500+</div>
                <div className="text-sm text-gray-300 uppercase tracking-widest">Corporate Clients</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-mci-amber mb-2">40+</div>
                <div className="text-sm text-gray-300 uppercase tracking-widest">Countries</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-mci-amber mb-2">98%</div>
                <div className="text-sm text-gray-300 uppercase tracking-widest">Pass Rate</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-mci-amber mb-2">ISO</div>
                <div className="text-sm text-gray-300 uppercase tracking-widest">Certified Material</div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Corporate;
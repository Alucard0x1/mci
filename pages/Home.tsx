import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Server, Activity, ChevronRight, Award, Users, CheckCircle } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { COURSES, TESTIMONIALS, ALUMNI_LOGOS } from '../constants';

const Home = () => {
  const featuredCourses = COURSES.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-mci-navy text-white py-20 lg:py-32 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-mci-teal/10 skew-x-12 translate-x-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 border border-mci-amber text-mci-amber text-xs font-bold tracking-widest uppercase mb-6 rounded-sm">
              Global Training Standard
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Critical Skills for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Resilient Operations</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Premier professional certification and training in Data Center Management, Business Continuity, and Cybersecurity for enterprise leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/programs/data-center" 
                className="inline-flex justify-center items-center px-8 py-4 bg-mci-amber text-white font-bold rounded shadow-lg hover:brightness-110 hover:shadow-xl transition-all"
              >
                Explore Programs
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex justify-center items-center px-8 py-4 bg-transparent border border-white text-white font-bold rounded hover:bg-white hover:text-mci-navy transition-all"
              >
                Corporate Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals: Alumni Logos */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {ALUMNI_LOGOS.map((logo, idx) => (
              <img key={idx} src={logo.url} alt={logo.name} className="h-8 md:h-10 object-contain" />
            ))}
          </div>
        </div>
      </section>

      {/* Core Domains */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mci-navy mb-4">Core Competency Areas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Specialized training tracks designed to build resilience in critical infrastructure and operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Domain 1 */}
            <div className="group p-8 border border-gray-100 rounded-lg bg-mci-lightGrey/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-mci-navy rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-mci-teal transition-colors">
                <Server size={28} />
              </div>
              <h3 className="text-xl font-bold text-mci-navy mb-3">Data Center</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Design, operations, and efficiency standards for mission-critical facilities. Covered standards include EN 50600 and TIA-942.</p>
              <Link to="/programs/data-center" className="text-mci-teal font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                View Courses <ChevronRight size={16} />
              </Link>
            </div>

            {/* Domain 2 */}
            <div className="group p-8 border border-gray-100 rounded-lg bg-mci-lightGrey/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-mci-navy rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-mci-teal transition-colors">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-mci-navy mb-3">Business Continuity</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Strategic resilience planning, ISO 22301 implementation, and crisis management leadership for organizational stability.</p>
              <Link to="/programs/business-continuity" className="text-mci-teal font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                View Courses <ChevronRight size={16} />
              </Link>
            </div>

            {/* Domain 3 */}
            <div className="group p-8 border border-gray-100 rounded-lg bg-mci-lightGrey/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-mci-navy rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-mci-teal transition-colors">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-mci-navy mb-3">Cybersecurity Risk</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">Operational technology security, critical infrastructure protection, and governance for risk officers.</p>
              <Link to="/programs/cybersecurity" className="text-mci-teal font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                View Courses <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-mci-lightGrey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-mci-navy mb-2">Featured Programs</h2>
              <p className="text-gray-600">Upcoming accredited sessions.</p>
            </div>
            <Link to="/calendar" className="hidden md:flex items-center gap-2 text-mci-navy font-bold hover:text-mci-teal transition-colors">
              Full Calendar <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/calendar" className="inline-flex items-center gap-2 text-mci-navy font-bold hover:text-mci-teal transition-colors">
              Full Calendar <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-mci-navy mb-6">Why Industry Leaders Choose MCI</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-mci-navy">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-mci-navy">Accredited Content</h4>
                    <p className="text-gray-600 text-sm">All courses adhere to global standards (ISO, EN, TIA) and provide recognized CPD hours.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-mci-navy">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-mci-navy">Expert Practitioners</h4>
                    <p className="text-gray-600 text-sm">Our instructors are active consultants, not just academics. They bring real-world scenarios to the classroom.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-mci-navy">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-mci-navy">Guaranteed to Run</h4>
                    <p className="text-gray-600 text-sm">We respect your schedule. Look for the GTR badge for guaranteed session availability.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-mci-navy p-8 md:p-12 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-mci-teal opacity-20 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
               <h3 className="text-2xl font-bold text-white mb-8 relative z-10">What Alumni Say</h3>
               <div className="space-y-8 relative z-10">
                  {TESTIMONIALS.map((t, idx) => (
                    <blockquote key={idx} className="border-l-4 border-mci-amber pl-4">
                      <p className="text-gray-200 italic mb-4">"{t.text}"</p>
                      <footer className="text-white font-semibold">
                        {t.author}
                        <span className="block text-mci-teal text-sm font-normal">{t.company}</span>
                      </footer>
                    </blockquote>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-mci-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Empower Your Workforce</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg">
            Customized training solutions for corporate teams. Delivered on-site or virtually.
          </p>
          <Link 
            to="/contact?type=corporate" 
            className="inline-block bg-white text-mci-teal px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Request Corporate Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
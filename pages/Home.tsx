import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Server, Activity, ChevronRight, Award, Users, CheckCircle, Zap, BookOpen, GraduationCap, Building2, Globe, Cpu } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { COURSES, TESTIMONIALS, ALUMNI_LOGOS } from '../constants';

const Home = () => {
  const featuredCourses = COURSES.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-mci-maroon text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 border border-mci-amber text-mci-amber text-xs font-bold tracking-widest uppercase mb-6 rounded-sm">
              Built for the AI Infrastructure Era
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Professional Learning for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Mission Critical Infrastructure</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
              As demand for digital infrastructure accelerates, the industry faces a critical gap — not in technology, but in skilled talent capable of designing, operating, and scaling it. This institute is designed to bridge that gap.
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
                className="inline-flex justify-center items-center px-8 py-4 bg-transparent border border-white text-white font-bold rounded hover:bg-white hover:text-mci-maroon transition-all"
              >
                Corporate Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Supported By / Partner Logos */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Supported By</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4'].map((partner, idx) => (
              <div key={idx} className="px-8 py-3 border border-gray-200 rounded text-gray-500 font-medium text-sm">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart — 3 Key Reasons */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-mci-maroon font-bold text-sm uppercase tracking-widest mb-2 block">Why MCI</span>
            <h2 className="text-3xl font-bold text-mci-text mb-4">Three Key Reasons Your Learning Experience is Unique</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">In an industry where reliability is non-negotiable, training cannot remain theoretical. Our programs reflect the realities of operating in live, high-stakes environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 border border-gray-100 rounded-lg bg-mci-lightGrey/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-mci-maroon rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-mci-amber transition-colors">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-mci-text mb-3">Live Critical Environments</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Participants are exposed to real-world operating conditions, not simulated scenarios. This hands-on approach ensures learning goes beyond concepts, equipping individuals with the confidence to perform in mission-critical environments.</p>
            </div>

            <div className="group p-8 border border-gray-100 rounded-lg bg-mci-lightGrey/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-mci-maroon rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-mci-amber transition-colors">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-bold text-mci-text mb-3">Instructor-Led Learning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">While many programs have shifted entirely online, we believe mission-critical skills require direct engagement. Our hybrid format enables deeper understanding, real-time problem solving, and direct access to experienced practitioners.</p>
            </div>

            <div className="group p-8 border border-gray-100 rounded-lg bg-mci-lightGrey/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-mci-maroon rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-mci-amber transition-colors">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-mci-text mb-3">Meaningful Industry Relationships</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Beyond technical knowledge, participants gain access to a community of peers, operators, and industry leaders. These in-person interactions foster long-term relationships and career opportunities beyond the classroom.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Programs — 3 Applied Programs */}
      <section className="py-20 bg-mci-lightGrey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-mci-maroon font-bold text-sm uppercase tracking-widest mb-2 block">Our Programs</span>
            <h2 className="text-3xl font-bold text-mci-text mb-4">Applied Professional Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Industry-led curriculum with structured pathways from Foundation to Executive Diploma level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BCM */}
            <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-mci-maroon p-6">
                <Activity size={32} className="text-white mb-3" />
                <h3 className="text-xl font-bold text-white">Applied Business Continuity Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Equip professionals with practical skills and frameworks to ensure operational resilience in high-risk, always-on environments.</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BookOpen size={14} className="text-mci-teal" />
                    <span>Foundation → Diploma → Advanced → Executive</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Globe size={14} className="text-mci-teal" />
                    <span>Singapore · Online Modular</span>
                  </div>
                </div>
                <Link to="/programs/business-continuity" className="text-mci-maroon font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Program <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Data Centers */}
            <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-mci-maroon p-6">
                <Server size={32} className="text-white mb-3" />
                <h3 className="text-xl font-bold text-white">Applied Data Centers</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Design, operations, sustainability, and AI infrastructure for mission-critical data center facilities in the modern era.</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BookOpen size={14} className="text-mci-teal" />
                    <span>Foundation → Diploma → Advanced (3 Tracks) → Executive</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Globe size={14} className="text-mci-teal" />
                    <span>Singapore · Online Modular</span>
                  </div>
                </div>
                <Link to="/programs/data-center" className="text-mci-maroon font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Program <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Cybersecurity */}
            <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-mci-maroon p-6">
                <Shield size={32} className="text-white mb-3" />
                <h3 className="text-xl font-bold text-white">Applied Cybersecurity</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Ethical hacking, governance & risk, cloud security, and incident response for modern digital infrastructure protection.</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BookOpen size={14} className="text-mci-teal" />
                    <span>Foundation → Diploma → Advanced (4 Tracks) → Executive</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Globe size={14} className="text-mci-teal" />
                    <span>Singapore · Online Modular</span>
                  </div>
                </div>
                <Link to="/programs/cybersecurity" className="text-mci-maroon font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Program <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-mci-text mb-4">Upcoming Sessions</h2>
            <p className="text-gray-600">Scheduled programs across all disciplines.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <div>Program</div>
              <div>Format</div>
              <div>Location</div>
              <div>Date</div>
              <div className="text-right">Action</div>
            </div>
            {[
              { program: 'Applied Business Continuity Management', format: 'Online Modular (Instructor-Led)', location: 'Singapore', date: 'August 2026', category: 'business-continuity' },
              { program: 'Applied Business Continuity Management', format: 'Foundation Level', location: 'Singapore', date: 'November 2026', category: 'business-continuity' },
              { program: 'Applied Data Centers', format: 'Online Modular (Instructor-Led)', location: 'Singapore', date: 'August 2026', category: 'data-center' },
              { program: 'Applied Data Centers', format: 'Foundation Level', location: 'Singapore', date: 'November 2026', category: 'data-center' },
              { program: 'Applied Cybersecurity', format: 'Online Modular (Instructor-Led)', location: 'Singapore', date: 'August 2026', category: 'cybersecurity' },
              { program: 'Applied Cybersecurity', format: 'Foundation Level', location: 'Singapore', date: 'November 2026', category: 'cybersecurity' },
            ].map((session, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 p-4 md:p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors items-center">
                <div className="font-bold text-mci-text text-sm">{session.program}</div>
                <div className="text-sm text-gray-600">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${session.format.includes('Online') ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                    {session.format}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{session.location}</div>
                <div className="text-sm font-medium text-mci-text">{session.date}</div>
                <div className="text-right">
                  <Link to={`/programs/${session.category}`} className="inline-block bg-mci-maroon hover:bg-mci-amber text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                    More Info & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/calendar" className="inline-flex items-center gap-2 text-mci-text font-bold hover:text-mci-maroon transition-colors">
              View Full Training Calendar <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Industry-Led Differentiators */}
      <section className="py-20 bg-mci-lightGrey border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-mci-maroon font-bold text-sm uppercase tracking-widest mb-2 block">Industry-Led. Future-Focused. Impact-Driven.</span>
              <h2 className="text-3xl font-bold text-mci-text mb-6">What Sets the Institute Apart</h2>
              <p className="text-gray-600 mb-8">Our deep integration with the industry ensures that every program delivers real, applicable value.</p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-mci-maroon/10 rounded-full flex items-center justify-center text-mci-maroon">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-mci-text">Shaped by Real Market Needs</h4>
                    <p className="text-gray-600 text-sm">Programs designed around emerging trends in AI, power, cooling, and infrastructure design.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-mci-maroon/10 rounded-full flex items-center justify-center text-mci-maroon">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-mci-text">Access to Industry Practitioners</h4>
                    <p className="text-gray-600 text-sm">Learn from operators, investors, and consultants who are actively shaping the industry.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-mci-maroon/10 rounded-full flex items-center justify-center text-mci-maroon">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-mci-text">Practical Over Theoretical</h4>
                    <p className="text-gray-600 text-sm">Focus on applicable skills with exposure to cutting-edge developments in AI data centers and energy-efficient infrastructure.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-mci-maroon p-8 md:p-12 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-mci-amber opacity-20 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
               <h3 className="text-2xl font-bold text-white mb-8 relative z-10">What Alumni Say</h3>
               <div className="space-y-8 relative z-10">
                  {TESTIMONIALS.map((t, idx) => (
                    <blockquote key={idx} className="border-l-4 border-mci-amber pl-4">
                      <p className="text-gray-200 italic mb-4">"{t.text}"</p>
                      <footer className="text-white font-semibold">
                        {t.author}
                        <span className="block text-mci-amber text-sm font-normal">{t.company}</span>
                      </footer>
                    </blockquote>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-mci-maroon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Empower Your Workforce</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg">
            Customized training solutions for corporate teams. Delivered on-site or virtually across the globe.
          </p>
          <Link 
            to="/contact?type=corporate" 
            className="inline-block bg-mci-amber text-white px-8 py-3 rounded font-bold hover:brightness-110 transition-colors shadow-lg"
          >
            Request Corporate Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

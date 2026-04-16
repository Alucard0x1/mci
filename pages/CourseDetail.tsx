import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES } from '../constants';
import { api } from '../lib/api';
import { 
  Calendar, Clock, Download, CheckCircle, User, Award, 
  ArrowRight, X, Bell, Play, ChevronDown, ChevronUp,
  Star, ShieldCheck, FileText, MonitorPlay, Building2, Server, Loader2
} from 'lucide-react';
import { Instructor, Schedule } from '../types';
import CourseCard from '../components/CourseCard';

// Helper to get user timezone
const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return 'Local Time';
  }
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [modalInstructor, setModalInstructor] = useState<any>(null);
  const [openCurriculumDay, setOpenCurriculumDay] = useState<number | null>(0);
  
  // Selection State
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  // Fetch course from API, fallback to static constants
  useEffect(() => {
    if (!id) return;
    api.getCourse(id)
      .then(data => setCourse(data))
      .catch(() => {
        // Fallback to static data
        const staticCourse = COURSES.find(c => c.id === id);
        if (staticCourse) setCourse(staticCourse);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Modals
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Form States
  const [syllabusEmail, setSyllabusEmail] = useState('');
  const [isSyllabusSubmitted, setIsSyllabusSubmitted] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSession, setWaitlistSession] = useState<{date: string, location: string} | null>(null);
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);

  // Related Courses
  const relatedCourses: any[] = [];

  const userTimezone = getUserTimezone();

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 140; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Scroll spy to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'curriculum', 'instructor', 'reviews', 'schedules'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={40} className="animate-spin text-mci-teal" /></div>;
  }

  if (!course) {
    return <div className="p-20 text-center text-mci-text font-bold text-xl">Course not found.</div>;
  }

  // --- Handlers ---
  const handleSyllabusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => { setIsSyllabusSubmitted(true); }, 800);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => { setIsWaitlistSubmitted(true); }, 800);
  };

  const openWaitlist = (session?: {date: string, location: string}) => {
    setWaitlistSession(session || null);
    setShowWaitlistModal(true);
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    if (schedule.status === 'Sold Out') return;
    setSelectedSchedule(schedule);
    // On mobile, scroll to booking summary
    if (window.innerWidth < 1024) {
      const bookingEl = document.getElementById('booking-sidebar');
      bookingEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCurriculumDay = (index: number) => {
    setOpenCurriculumDay(openCurriculumDay === index ? null : index);
  };

  return (
    <div className="bg-white pb-20">
      
      {/* --- Modals --- */}
      {modalInstructor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden relative">
             <button onClick={() => setModalInstructor(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"><X size={20} /></button>
             <div className="p-8">
                <div className="flex items-center gap-6 mb-6">
                   <img src={modalInstructor.imageUrl} alt={modalInstructor.name} className="w-24 h-24 rounded-full object-cover border-4 border-mci-lightGrey" />
                   <div>
                     <h3 className="text-2xl font-bold text-mci-text">{modalInstructor.name}</h3>
                     <p className="text-mci-teal font-medium">{modalInstructor.title}</p>
                   </div>
                </div>
                <div className="prose text-gray-600 text-sm"><p>{modalInstructor.bio}</p></div>
             </div>
           </div>
        </div>
      )}

      {showVideoModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 print:hidden">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden">
             <button onClick={() => setShowVideoModal(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"><X size={32} /></button>
             <div className="w-full h-full flex items-center justify-center text-white">
               <div className="text-center">
                 <Play size={64} className="mx-auto mb-4 opacity-50" />
                 <p className="text-lg">Course Introduction Video Placeholder</p>
               </div>
             </div>
          </div>
        </div>
      )}

      {showSyllabusModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-mci-maroon/80 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative p-8">
             <button onClick={() => {setShowSyllabusModal(false); setIsSyllabusSubmitted(false); setSyllabusEmail('');}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
             {!isSyllabusSubmitted ? (
               <>
                 <div className="text-center mb-6">
                   <div className="w-12 h-12 bg-mci-lightGrey rounded-full flex items-center justify-center mx-auto mb-4 text-mci-text"><Download size={24} /></div>
                   <h3 className="text-xl font-bold text-mci-text">Download Syllabus</h3>
                   <p className="text-sm text-gray-600 mt-2">Enter your email to receive the full breakdown for <span className="font-semibold">{course.code}</span>.</p>
                 </div>
                 <form onSubmit={handleSyllabusSubmit} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Email</label>
                     <input type="email" required placeholder="you@company.com" value={syllabusEmail} onChange={(e) => setSyllabusEmail(e.target.value)} className="w-full border border-gray-300 rounded p-3 focus:border-mci-teal focus:ring-1 focus:ring-mci-teal outline-none" />
                   </div>
                   <button type="submit" className="w-full bg-mci-teal text-white font-bold py-3 rounded hover:bg-mci-maroon transition-colors">Send Syllabus</button>
                 </form>
               </>
             ) : (
               <div className="text-center py-8">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle size={32} /></div>
                 <h3 className="text-xl font-bold text-mci-text mb-2">Sent!</h3>
                 <p className="text-gray-600 text-sm">Check your inbox at <strong>{syllabusEmail}</strong>.</p>
                 <button onClick={() => {setShowSyllabusModal(false); setIsSyllabusSubmitted(false); setSyllabusEmail('');}} className="mt-6 text-mci-teal font-bold text-sm hover:underline">Close</button>
               </div>
             )}
           </div>
        </div>
      )}

      {showWaitlistModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-mci-maroon/80 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative p-8">
             <button onClick={() => {setShowWaitlistModal(false); setIsWaitlistSubmitted(false); setWaitlistEmail('');}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
             {!isWaitlistSubmitted ? (
               <>
                 <div className="text-center mb-6">
                   <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600"><Bell size={24} /></div>
                   <h3 className="text-xl font-bold text-mci-text">Join Waitlist</h3>
                   <p className="text-sm text-gray-600 mt-2">{waitlistSession ? <>Get notified if a seat opens up for <strong>{waitlistSession.date}</strong>.</> : <>Get notified when new dates are announced.</>}</p>
                 </div>
                 <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                     <input type="email" required placeholder="you@company.com" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} className="w-full border border-gray-300 rounded p-3 focus:border-mci-teal focus:ring-1 focus:ring-mci-teal outline-none" />
                   </div>
                   <button type="submit" className="w-full bg-mci-maroon text-white font-bold py-3 rounded hover:bg-mci-teal transition-colors shadow-lg active:scale-[0.98]">Alert Me</button>
                 </form>
               </>
             ) : (
               <div className="text-center py-8">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle size={32} /></div>
                 <h3 className="text-xl font-bold text-mci-text mb-2">You're on the list!</h3>
                 <button onClick={() => {setShowWaitlistModal(false); setIsWaitlistSubmitted(false); setWaitlistEmail('');}} className="mt-6 text-mci-teal font-bold text-sm hover:underline">Close</button>
               </div>
             )}
           </div>
        </div>
      )}

      {/* --- Breadcrumbs --- */}
      <div className="bg-white pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <nav className="flex text-xs text-gray-500">
             <Link to="/" className="hover:text-mci-teal">Home</Link>
             <span className="mx-2">/</span>
             <Link to={`/programs/${(course.program || course.category || '').toLowerCase().replace(' ', '-')}`} className="hover:text-mci-teal">{course.program || course.category}</Link>
             <span className="mx-2">/</span>
             <span className="text-gray-800 font-medium">{course.code} Certification</span>
           </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* --- Left Column: Main Content --- */}
          <div className="flex-1 min-w-0">
            
            {/* Hero Content (Now in left column) */}
            <div className="animate-in slide-in-from-bottom-4 duration-700 mb-12">
               <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-mci-teal/10 text-mci-teal px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-mci-teal/20 flex items-center gap-1.5">
                  <Server size={14} /> {course.program || course.category}
                </span>
                <span className="bg-green-50 text-green-700 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-green-200 flex items-center gap-1">
                  <CheckCircle size={12} /> Guaranteed to Run
                </span>
                <span className="bg-mci-amber/10 text-mci-amber px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border border-mci-amber/20">
                  Bestseller
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-mci-text mb-6 leading-tight">{course.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{course.overview}</p>
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-mci-lightGrey rounded-xl p-4">
                    <Clock size={20} className="text-mci-teal mb-2" />
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Duration</div>
                    <div className="font-bold text-mci-text">{course.duration}</div>
                </div>
                <div className="bg-mci-lightGrey rounded-xl p-4">
                    <Award size={20} className="text-mci-teal mb-2" />
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Level</div>
                    <div className="font-bold text-mci-text">{course.level}</div>
                </div>
                <div className="bg-mci-lightGrey rounded-xl p-4">
                    <MonitorPlay size={20} className="text-mci-teal mb-2" />
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Delivery</div>
                    <div className="font-bold text-mci-text">Virtual / Classroom</div>
                </div>
                <div className="bg-mci-lightGrey rounded-xl p-4">
                    <Star size={20} className="text-mci-amber fill-mci-amber mb-2" />
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Rating</div>
                    <div className="font-bold text-mci-text">{course.reviewStats?.average} <span className="font-normal text-gray-400 text-xs">({course.reviewStats?.total})</span></div>
                </div>
              </div>
            </div>

            {/* Sticky Tabs (Within Left Column) */}
            <div className="sticky top-20 z-30 bg-white border-b border-gray-200 mb-8 -mx-4 px-4 md:mx-0 md:px-0">
               <div className="flex overflow-x-auto no-scrollbar gap-8">
                {[
                  'Overview',
                  ...(course.curriculum?.length > 0 ? ['Curriculum'] : []),
                  ...(course.instructor ? ['Instructor'] : []),
                  ...(course.reviews?.length > 0 || course.reviewStats?.total > 0 ? ['Reviews'] : []),
                  ...(course.schedules?.length > 0 ? ['Schedules'] : []),
                ].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section.toLowerCase())}
                    className={`py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeSection === section.toLowerCase() 
                        ? 'border-mci-teal text-mci-text' 
                        : 'border-transparent text-gray-500 hover:text-mci-text'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-16">
              
              {/* Overview */}
              <section id="overview" className="scroll-mt-40">
                <h2 className="text-2xl font-bold text-mci-text mb-6">Program Overview</h2>
                <div className="prose text-gray-600 max-w-none">
                    <p className="mb-6">This intensive training program is designed to bridge the gap between theoretical knowledge and practical application. Participants will engage in case studies, group exercises, and real-world simulations.</p>
                    
                    <h3 className="text-lg font-bold text-mci-text mb-4">Key Learning Outcomes</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {course.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle size={18} className="text-mci-teal flex-shrink-0 mt-1" />
                          <span className="text-sm">{obj}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6">
                       <h3 className="text-sm font-bold text-mci-text uppercase tracking-widest mb-4">Who Should Attend</h3>
                       <div className="flex flex-wrap gap-2 mb-6">
                         {course.audience.map((aud, i) => (
                           <span key={i} className="px-3 py-1 bg-white border border-blue-100 rounded text-xs font-medium text-gray-700">{aud}</span>
                         ))}
                       </div>
                       
                       <h3 className="text-sm font-bold text-mci-text uppercase tracking-widest mb-2">Prerequisites</h3>
                       <ul className="space-y-2 text-xs text-gray-600">
                         {course.prerequisites?.map((pre, i) => (
                           <li key={i} className="flex items-start gap-2">
                             <span className="text-blue-400">•</span> {pre}
                           </li>
                         ))}
                       </ul>
                    </div>
                 </div>
              </section>

              {/* Curriculum */}
              {(course.curriculum?.length > 0) && (
              <section id="curriculum" className="scroll-mt-40">
                 <div className="flex justify-between items-end mb-6">
                  <h2 className="text-2xl font-bold text-mci-text">Course Curriculum</h2>
                  <button onClick={() => setShowSyllabusModal(true)} className="text-mci-teal font-bold text-sm flex items-center gap-2 hover:underline">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                  {course.curriculum?.map((day, idx) => (
                    <div key={idx} className="bg-white">
                      <button 
                        onClick={() => toggleCurriculumDay(idx)}
                        className="w-full flex items-center justify-between p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-mci-text">{day.dayTitle}</span>
                        {openCurriculumDay === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                      </button>
                      {openCurriculumDay === idx && (
                        <div className="p-5 animate-in slide-in-from-top-2 duration-200 bg-gray-50/50">
                           <div className="space-y-6">
                             {day.modules.map((mod, mIdx) => (
                               <div key={mIdx} className="pl-4 border-l-2 border-mci-teal/20">
                                 <div className="flex justify-between items-start mb-2">
                                   <h4 className="font-bold text-gray-800 text-sm">{mod.title}</h4>
                                   <span className="text-xs text-gray-500 font-mono bg-white border border-gray-200 px-2 py-0.5 rounded">{mod.duration}</span>
                                 </div>
                                 <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                                   {mod.topics.map((topic, tIdx) => (
                                     <li key={tIdx}>{topic}</li>
                                   ))}
                                 </ul>
                               </div>
                             ))}
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
              )}

              {/* Instructor */}
              {course.instructor && (
              <section id="instructor" className="scroll-mt-40">
                 <h2 className="text-2xl font-bold text-mci-text mb-6">Meet Your Instructor</h2>
                 <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col sm:flex-row gap-8 items-start hover:shadow-md transition-shadow cursor-pointer" onClick={() => setModalInstructor(course.instructor)}>
                    <div className="flex-shrink-0">
                      {course.instructor.imageUrl ? (
                        <img src={course.instructor.imageUrl} alt={course.instructor.name} className="w-24 h-24 rounded-full object-cover shadow-sm border-4 border-gray-50" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-gray-50"><User size={36} /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <div>
                           <h3 className="text-xl font-bold text-mci-text">{course.instructor.name}</h3>
                           <p className="text-mci-teal font-medium mb-4">{course.instructor.title}</p>
                         </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{course.instructor.bio}</p>
                      <button className="text-mci-text text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        View Full Profile <ArrowRight size={14} />
                      </button>
                    </div>
                 </div>
              </section>
              )}

              {/* Reviews */}
              {(course.reviews?.length > 0 || course.reviewStats?.total > 0) && (
              <section id="reviews" className="scroll-mt-40">
                 <h2 className="text-2xl font-bold text-mci-text mb-6">Student Reviews</h2>
                 <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row gap-8 items-center mb-8">
                    <div className="text-center md:text-left min-w-[120px]">
                      <div className="text-5xl font-bold text-mci-text mb-1">{course.reviewStats?.average}</div>
                      <div className="flex justify-center md:justify-start gap-0.5 mb-1">
                        {[1,2,3,4,5].map(star => <Star key={star} size={14} className={`${star <= Math.round(course.reviewStats?.average || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                      </div>
                      <div className="text-xs text-gray-500">{course.reviewStats?.total} reviews</div>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                       {[5,4,3,2,1].map(star => {
                        const count = course.reviewStats?.distribution[star as 1|2|3|4|5] || 0;
                        const percent = (count / (course.reviewStats?.total || 1)) * 100;
                        return (
                          <div key={star} className="flex items-center gap-3 text-xs">
                            <span className="w-3 font-bold text-gray-500">{star}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-mci-amber rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="w-8 text-right text-gray-400">{percent.toFixed(0)}%</span>
                          </div>
                        )
                      })}
                    </div>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-6">
                    {course.reviews?.map(review => (
                      <div key={review.id} className="border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-8 h-8 rounded-full bg-mci-maroon/10 flex items-center justify-center text-xs font-bold text-mci-text">{review.author.charAt(0)}</div>
                           <div>
                             <div className="text-sm font-bold text-mci-text">{review.author}</div>
                             <div className="text-xs text-gray-400">{review.role}</div>
                           </div>
                           <div className="ml-auto flex gap-0.5">
                             {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
                           </div>
                        </div>
                        <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                      </div>
                    ))}
                 </div>
              </section>
              )}

              {/* Schedules */}
              {(course.schedules?.length > 0) && (
              <section id="schedules" className="scroll-mt-40">
                  <h2 className="text-2xl font-bold text-mci-text mb-6">Upcoming Dates</h2>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                   <div className="grid grid-cols-4 bg-gray-50 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <div>Date</div>
                      <div className="hidden sm:block">Location</div>
                      <div>Status</div>
                      <div className="text-right">Action</div>
                   </div>
                   <div className="divide-y divide-gray-100">
                      {(course.schedules || []).map((schedule: any) => {
                         const isSelected = selectedSchedule?.id === schedule.id;
                         return (
                           <div key={schedule.id} className={`grid grid-cols-4 p-4 items-center transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                              <div>
                                 <div className="font-bold text-mci-text">{new Date(schedule.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                                 <div className="text-xs text-gray-500">{new Date(schedule.startDate).getFullYear()}</div>
                              </div>
                              <div className="hidden sm:block text-sm">
                                 <div className="font-medium text-gray-900">{schedule.location}</div>
                                 <div className="text-xs text-gray-500">{schedule.type}</div>
                              </div>
                              <div className="col-span-1">
                                 {schedule.status === 'Guaranteed' && <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> <span className="hidden md:inline">Guaranteed</span></span>}
                                 {schedule.status === 'Limited' && <span className="text-orange-500 text-xs font-bold flex items-center gap-1"><Bell size={12} /> <span className="hidden md:inline">Limited</span></span>}
                                 {schedule.status === 'Sold Out' && <span className="text-gray-400 text-xs font-bold">Sold Out</span>}
                                 {schedule.status === 'Open' && <span className="text-blue-600 text-xs font-bold">Open</span>}
                              </div>
                              <div className="text-right">
                                 {schedule.status === 'Sold Out' ? (
                                    <button onClick={() => openWaitlist({date: new Date(schedule.startDate).toLocaleDateString(), location: schedule.location})} className="text-mci-text hover:text-mci-teal text-xs font-bold underline">Waitlist</button>
                                 ) : (
                                    <button 
                                      onClick={() => handleSelectSchedule(schedule)}
                                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-xs font-bold transition-all ${
                                        isSelected 
                                          ? 'bg-mci-teal text-white shadow-sm' 
                                          : 'bg-white border border-mci-maroon text-mci-text hover:bg-mci-maroon hover:text-white'
                                      }`}
                                    >
                                      {isSelected ? 'Selected' : 'Select'}
                                    </button>
                                 )}
                              </div>
                           </div>
                         );
                      })}
                   </div>
                </div>
              </section>
              )}

            </div>
          </div>

          {/* --- Right Column: Sticky Sidebar --- */}
          <div className="w-full lg:w-[380px] flex-shrink-0" id="booking-sidebar">
             <div className="sticky top-24 space-y-6">
                
                {/* Booking Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-right duration-700">
                   {/* Video Header */}
                   <div className="relative h-48 bg-gray-900 group cursor-pointer" onClick={() => setShowVideoModal(true)}>
                      <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80" alt="Intro Video" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <Play size={28} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white text-sm font-bold">Watch Intro Video</div>
                   </div>

                   <div className="p-6">
                      <div className="flex items-baseline gap-2 mb-2">
                         <span className="text-4xl font-bold text-mci-text">${course.price}</span>
                         <span className="text-gray-400 line-through text-lg">${course.price + 500}</span>
                      </div>
                      <div className="inline-block bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-100 mb-6">
                         Save 17% • Early Bird Offer
                      </div>

                      {selectedSchedule ? (
                         <div className="bg-blue-50 border border-blue-100 rounded p-3 mb-4 animate-in fade-in">
                            <div className="text-xs font-bold text-blue-800 uppercase mb-1">Session Selected</div>
                            <div className="text-sm font-bold text-gray-900">{new Date(selectedSchedule.startDate).toLocaleDateString()} - {selectedSchedule.location}</div>
                         </div>
                      ) : course.schedules?.length > 0 ? (
                        <div className="text-xs text-gray-500 italic mb-4 text-center">Select a date from the schedule below, or enroll directly</div>
                      ) : null}

                      <div className="space-y-3 mb-6">
                        <button 
                          className="w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-mci-amber hover:bg-yellow-500 text-white"
                          onClick={() => {
                             if(selectedSchedule) {
                                window.location.href = `/register/${course.id}?schedule=${selectedSchedule.id}`;
                             } else if (course.schedules?.length > 0) {
                                // Has schedules but none selected — scroll to schedules section
                                document.getElementById('schedules')?.scrollIntoView({behavior: 'smooth'});
                             } else {
                                // No schedules — go directly to register
                                window.location.href = `/register/${course.id}`;
                             }
                          }}
                        >
                          <Calendar size={20} />
                          {selectedSchedule ? 'Proceed to Checkout' : course.schedules?.length > 0 ? 'Select Date & Enroll' : 'Enroll Now'}
                        </button>
                        
                        <button 
                          onClick={() => window.location.href = '/contact?type=corporate'}
                          className="w-full py-3.5 rounded-lg font-bold text-mci-text border-2 border-mci-maroon hover:bg-mci-maroon hover:text-white transition-colors flex items-center justify-center gap-2">
                          <Building2 size={18} /> Request Corporate Quote
                        </button>
                      </div>

                      <div className="border-t border-gray-100 pt-4 space-y-3">
                         <div className="flex items-start gap-3">
                           <CheckCircle size={16} className="text-mci-teal mt-0.5" />
                           <span className="text-sm text-gray-700">Official Exam Included</span>
                         </div>
                         <div className="flex items-start gap-3">
                           <CheckCircle size={16} className="text-mci-teal mt-0.5" />
                           <span className="text-sm text-gray-700">Comprehensive Courseware</span>
                         </div>
                         <div className="flex items-start gap-3">
                           <CheckCircle size={16} className="text-mci-teal mt-0.5" />
                           <span className="text-sm text-gray-700">12 Months Support</span>
                         </div>
                         <div className="flex items-start gap-3">
                           <CheckCircle size={16} className="text-mci-teal mt-0.5" />
                           <span className="text-sm text-gray-700">Digital Certificate</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                      <button onClick={() => setShowSyllabusModal(true)} className="text-mci-text font-bold text-sm hover:text-mci-teal flex items-center justify-center gap-2 transition-colors">
                        <Download size={16} /> Download Full Syllabus (PDF)
                      </button>
                   </div>
                </div>

                {/* Need Help Box */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                   <h4 className="font-bold text-mci-text mb-2">Have questions?</h4>
                   <p className="text-sm text-gray-600 mb-4">Our training advisors are available to help you find the right certification path.</p>
                   <Link to="/contact" className="text-mci-teal font-bold text-sm flex items-center gap-2 hover:underline">
                      Contact Advisor <ArrowRight size={14} />
                   </Link>
                </div>

             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
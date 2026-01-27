import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, ChevronDown, Menu, X, Mail, Phone, MapPin, Linkedin, Twitter, ArrowRight,
  Server, Shield, Activity, FileText, Download, Users
} from 'lucide-react';
import TopBanner from './TopBanner';

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Simulate search by navigating to calendar with a filter or generic search result page
      // For prototype, we'll go to calendar
      navigate('/calendar');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-mci-navy/90 backdrop-blur-sm flex items-start justify-center pt-32 animate-in fade-in duration-200">
      <button onClick={onClose} className="absolute top-8 right-8 text-white/70 hover:text-white">
        <X size={32} />
      </button>
      <div className="w-full max-w-3xl px-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-white text-mci-navy text-xl font-medium py-6 pl-14 pr-6 rounded-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-mci-teal/50"
            placeholder="Search for courses, topics, or instructors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-4 flex gap-2 text-white/60 text-sm">
            <span>Popular:</span>
            <button type="button" className="hover:text-white underline" onClick={() => navigate('/programs/data-center')}>Data Center</button>
            <button type="button" className="hover:text-white underline" onClick={() => navigate('/programs/cybersecurity')}>Cybersecurity</button>
            <button type="button" className="hover:text-white underline" onClick={() => navigate('/programs/business-continuity')}>ISO 22301</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProgramMenuOpen, setIsProgramMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if navbar should be hidden
      // Hide on scroll down (if > 100px), show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      // Compact styling threshold
      setIsScrolled(currentScrollY > 20);
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Mega Menu Delay Logic
  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setIsProgramMenuOpen(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsProgramMenuOpen(false);
    }, 300); // 300ms delay as per brief
  };

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <div 
        className={`fixed w-full z-40 flex flex-col print:hidden transition-transform duration-300 ease-in-out ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <TopBanner />
        <nav 
          className={`w-full transition-all duration-300 border-b ${
            isScrolled ? 'bg-white/95 backdrop-blur-sm py-2 shadow-md border-gray-200' : 'bg-white py-4 border-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="w-10 h-10 bg-mci-navy rounded-sm flex items-center justify-center text-white font-bold text-xl group-hover:bg-mci-teal transition-colors">
                    MCI
                  </div>
                  <div className="flex flex-col">
                    <span className="text-mci-navy font-bold text-lg leading-tight tracking-tight">MCI TRAINING</span>
                    <span className="text-xs text-gray-500 tracking-widest uppercase">Institute</span>
                  </div>
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-8">
                <div 
                  className="relative group h-full flex items-center"
                  onMouseEnter={handleMenuEnter}
                  onMouseLeave={handleMenuLeave}
                >
                  <button 
                    className={`text-mci-text hover:text-mci-teal font-medium flex items-center gap-1 py-2 ${isProgramMenuOpen ? 'text-mci-teal' : ''}`}
                  >
                    Programs <ChevronDown size={16} className={`transition-transform duration-300 ${isProgramMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Mega Menu Dropdown */}
                  <div 
                    className={`absolute top-full -left-4 w-[900px] bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 origin-top-left ${
                      isProgramMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                    }`}
                  >
                    <div className="grid grid-cols-3 divide-x divide-gray-50 p-8 gap-8">
                      {/* Column 1: Data Center */}
                      <div className="space-y-4 group/item">
                        <Link to="/programs/data-center" className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-blue-50 text-mci-navy rounded-lg group-hover/item:bg-mci-navy group-hover/item:text-white transition-colors">
                             <Server size={24} />
                           </div>
                           <h3 className="font-bold text-lg text-mci-navy group-hover/item:text-mci-teal transition-colors">Data Center</h3>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                          Design, operations, and efficiency standards (TIA-942, EN 50600) for mission-critical facilities.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li><Link to="/courses/dc-101" className="block text-gray-600 hover:text-mci-teal hover:translate-x-1 transition-all">Certified Design Professional</Link></li>
                          <li><Link to="/courses/dc-101" className="block text-gray-600 hover:text-mci-teal hover:translate-x-1 transition-all">Operations Specialist</Link></li>
                          <li><Link to="/programs/data-center" className="text-mci-teal font-bold text-xs uppercase tracking-wider mt-2 inline-block">View All Courses &rarr;</Link></li>
                        </ul>
                      </div>

                      {/* Column 2: Business Continuity */}
                      <div className="space-y-4 group/item">
                        <Link to="/programs/business-continuity" className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-blue-50 text-mci-navy rounded-lg group-hover/item:bg-mci-navy group-hover/item:text-white transition-colors">
                             <Activity size={24} />
                           </div>
                           <h3 className="font-bold text-lg text-mci-navy group-hover/item:text-mci-teal transition-colors">Business Continuity</h3>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                          Resilience planning and ISO 22301 implementation for organizational stability.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li><Link to="/courses/bcm-200" className="block text-gray-600 hover:text-mci-teal hover:translate-x-1 transition-all">ISO 22301 Lead Implementer</Link></li>
                          <li><Link to="/courses/bcm-200" className="block text-gray-600 hover:text-mci-teal hover:translate-x-1 transition-all">Crisis Management</Link></li>
                          <li><Link to="/programs/business-continuity" className="text-mci-teal font-bold text-xs uppercase tracking-wider mt-2 inline-block">View All Courses &rarr;</Link></li>
                        </ul>
                      </div>

                      {/* Column 3: Cybersecurity */}
                      <div className="space-y-4 group/item">
                        <Link to="/programs/cybersecurity" className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-blue-50 text-mci-navy rounded-lg group-hover/item:bg-mci-navy group-hover/item:text-white transition-colors">
                             <Shield size={24} />
                           </div>
                           <h3 className="font-bold text-lg text-mci-navy group-hover/item:text-mci-teal transition-colors">Cybersecurity</h3>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                           Critical infrastructure protection, SCADA security, and operational risk governance.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li><Link to="/courses/cyb-300" className="block text-gray-600 hover:text-mci-teal hover:translate-x-1 transition-all">OT/ICS Security</Link></li>
                          <li><Link to="/courses/cyb-300" className="block text-gray-600 hover:text-mci-teal hover:translate-x-1 transition-all">NIS2 Compliance</Link></li>
                          <li><Link to="/programs/cybersecurity" className="text-mci-teal font-bold text-xs uppercase tracking-wider mt-2 inline-block">View All Courses &rarr;</Link></li>
                        </ul>
                      </div>
                    </div>

                    {/* Mega Menu Footer */}
                    <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-100">
                      <div className="flex gap-6">
                        <Link to="/calendar" className="text-sm font-bold text-mci-navy flex items-center gap-2 hover:text-mci-teal">
                          <FileText size={16} /> Training Calendar
                        </Link>
                        <Link to="/corporate" className="text-sm font-bold text-mci-navy flex items-center gap-2 hover:text-mci-teal">
                          <Users size={16} /> Team Training
                        </Link>
                      </div>
                      <Link to="/resources" className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2 hover:text-mci-navy transition-colors">
                         <Download size={14} /> Download 2026 Course Catalog
                      </Link>
                    </div>
                  </div>
                </div>

                <Link to="/corporate" className="text-mci-text hover:text-mci-teal font-medium transition-colors">Corporate</Link>
                <Link to="/about" className="text-mci-text hover:text-mci-teal font-medium transition-colors">About Us</Link>
                <Link to="/resources" className="text-mci-text hover:text-mci-teal font-medium transition-colors">Resources</Link>
              </div>

              {/* Right Utilities */}
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-500 hover:text-mci-teal transition-colors"
                >
                  <Search size={20} />
                </button>
                <Link to="/contact" className="text-mci-navy font-medium hover:underline decoration-mci-teal underline-offset-4">
                  Contact
                </Link>
                <Link 
                  to="/contact?type=enquire" 
                  className="bg-mci-amber hover:brightness-105 text-white px-6 py-2.5 rounded font-semibold transition-all shadow-sm hover:shadow active:scale-[0.98]"
                >
                  Enquire
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-mci-navy p-2"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          <div className={`md:hidden fixed inset-0 z-40 bg-white transform transition-transform duration-300 pt-24 px-6 overflow-y-auto pb-10 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col space-y-8 text-lg">
              
              {/* Mobile Programs Section */}
              <div className="space-y-4 border-b border-gray-100 pb-8">
                <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Training Programs</span>
                
                <Link to="/programs/data-center" className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-blue-50 text-mci-navy rounded">
                    <Server size={20} />
                  </div>
                  <span className="text-mci-navy font-bold">Data Center</span>
                </Link>

                <Link to="/programs/business-continuity" className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-blue-50 text-mci-navy rounded">
                    <Activity size={20} />
                  </div>
                  <span className="text-mci-navy font-bold">Business Continuity</span>
                </Link>

                <Link to="/programs/cybersecurity" className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-blue-50 text-mci-navy rounded">
                    <Shield size={20} />
                  </div>
                  <span className="text-mci-navy font-bold">Cybersecurity</span>
                </Link>
              </div>

              <div className="space-y-6 flex flex-col">
                <Link to="/corporate" className="text-mci-navy font-medium flex items-center gap-3">
                   <Users size={20} className="text-gray-400" /> Corporate Services
                </Link>
                <Link to="/about" className="text-mci-navy font-medium flex items-center gap-3">
                   <MapPin size={20} className="text-gray-400" /> About Us
                </Link>
                <Link to="/resources" className="text-mci-navy font-medium flex items-center gap-3">
                   <FileText size={20} className="text-gray-400" /> Resources
                </Link>
                <Link to="/calendar" className="text-mci-navy font-medium flex items-center gap-3">
                   <Search size={20} className="text-gray-400" /> Training Calendar
                </Link>
                <Link to="/contact" className="text-mci-navy font-medium flex items-center gap-3">
                   <Mail size={20} className="text-gray-400" /> Contact
                </Link>
              </div>

              <Link 
                to="/contact?type=enquire" 
                className="bg-mci-amber text-white text-center py-4 rounded-lg font-bold shadow-md active:scale-[0.98]"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="bg-mci-navy text-white pt-16 pb-8 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white/10 rounded-sm flex items-center justify-center text-white font-bold">M</div>
                <span className="font-bold text-xl tracking-tight">MCI TRAINING</span>
              </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Empowering professionals with accredited training in Data Centers, Business Continuity, and Cybersecurity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-6">Programs</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link to="/programs/data-center" className="hover:text-white transition-colors">Data Center Design</Link></li>
              <li><Link to="/programs/data-center" className="hover:text-white transition-colors">Operations Management</Link></li>
              <li><Link to="/programs/business-continuity" className="hover:text-white transition-colors">Business Continuity (ISO 22301)</Link></li>
              <li><Link to="/programs/cybersecurity" className="hover:text-white transition-colors">Cybersecurity Risk</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-6">Institution</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/corporate" className="hover:text-white transition-colors">Corporate Solutions</Link></li>
              <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-mci-teal mt-0.5" />
                <span>123 Innovation Drive,<br/>Tech Park, London, UK</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-mci-teal" />
                <span>+44 20 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-mci-teal" />
                <span>admissions@mci-training.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} MCI Training Institute. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-[100px] md:pt-[104px] print:pt-0">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
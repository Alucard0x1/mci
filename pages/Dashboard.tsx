import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import {
  BookOpen, CalendarDays, MessageSquare, Download, Bell,
  LogOut, Loader2, LayoutDashboard, GraduationCap, Handshake, UserCircle
} from 'lucide-react';
import DashboardCourses from './DashboardCourses';
import DashboardPartners from './DashboardPartners';
import DashboardInstructors from './DashboardInstructors';

interface Stats {
  courseCount: number;
  scheduleCount: number;
  enquiryCount: number;
  leadCount: number;
  waitlistCount: number;
}

type Page = 'overview' | 'courses' | 'partners' | 'instructors';

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'leads' | 'waitlist'>('enquiries');
  const [tabData, setTabData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page>('overview');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.getDashboardStats(),
      api.getDashboardEnquiries(),
    ]).then(([s, e]) => {
      setStats(s);
      setTabData(e);
    }).catch(() => { logout(); navigate('/login'); })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'enquiries') api.getDashboardEnquiries().then(setTabData);
    else if (activeTab === 'leads') api.getDashboardLeads().then(setTabData);
    else api.getDashboardWaitlist().then(setTabData);
  }, [activeTab, user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 size={40} className="animate-spin text-mci-teal" /></div>;
  }
  if (!user) return null;

  const statCards = [
    { label: 'Courses', value: stats?.courseCount ?? 0, icon: BookOpen, color: 'bg-blue-50 text-blue-700' },
    { label: 'Schedules', value: stats?.scheduleCount ?? 0, icon: CalendarDays, color: 'bg-green-50 text-green-700' },
    { label: 'Enquiries', value: stats?.enquiryCount ?? 0, icon: MessageSquare, color: 'bg-amber-50 text-amber-700' },
    { label: 'Syllabus Leads', value: stats?.leadCount ?? 0, icon: Download, color: 'bg-purple-50 text-purple-700' },
    { label: 'Waitlist', value: stats?.waitlistCount ?? 0, icon: Bell, color: 'bg-red-50 text-red-700' },
  ];

  const sidebarItems = [
    { id: 'overview' as Page, label: 'Overview', icon: LayoutDashboard },
    { id: 'courses' as Page, label: 'Courses', icon: GraduationCap },
    { id: 'instructors' as Page, label: 'Instructors', icon: UserCircle },
    { id: 'partners' as Page, label: 'Partners', icon: Handshake },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-mci-navy text-white flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/mciwhite.png" alt="MCI" className="h-8 w-auto" />
            <span className="font-bold text-lg">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-300">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 flex-shrink-0 hidden md:block">
          <nav className="p-4 space-y-1">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activePage === item.id
                    ? 'bg-mci-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-b border-gray-200 bg-white px-4 py-2 gap-2 overflow-x-auto flex-shrink-0">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                activePage === item.id ? 'bg-mci-navy text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          {activePage === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-mci-navy mb-6">Overview</h2>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {statCards.map(card => (
                  <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                      <card.icon size={20} />
                    </div>
                    <div className="text-2xl font-bold text-mci-navy">{card.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Enquiries/Leads/Waitlist tabs */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {(['enquiries', 'leads', 'waitlist'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-bold capitalize transition-colors ${
                        activeTab === tab ? 'text-mci-navy border-b-2 border-mci-teal bg-gray-50' : 'text-gray-500 hover:text-mci-navy'
                      }`}
                    >{tab}</button>
                  ))}
                </div>
                <div className="divide-y divide-gray-100">
                  {tabData.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No data yet.</div>
                  ) : tabData.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-start">
                      <div>
                        <div className="font-bold text-mci-navy text-sm">{item.name || item.email}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.email} {item.type && `· ${item.type}`} {item.course_title && `· ${item.course_title}`}
                        </div>
                        {item.message && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.message}</p>}
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'courses' && <DashboardCourses />}
          {activePage === 'instructors' && <DashboardInstructors />}
          {activePage === 'partners' && <DashboardPartners />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

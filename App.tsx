import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import Calendar from './pages/Calendar';
import Contact from './pages/Contact';
import ProgramCategory from './pages/ProgramCategory';
import About from './pages/About';
import Resources from './pages/Resources';
import Admissions from './pages/Admissions';
import Corporate from './pages/Corporate';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Policy from './pages/Policy';
import Register from './pages/Register';
import RegisterConfirmation from './pages/RegisterConfirmation';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth pages — no Layout wrapper */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Public pages — with Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/programs/:categoryId" element={<ProgramCategory />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/corporate" element={<Corporate />} />
                <Route path="/about" element={<About />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/admissions" element={<Admissions />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/register/:courseId" element={<Register />} />
                <Route path="/register/confirmation/:registrationId" element={<RegisterConfirmation />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
    <Router>
      <ScrollToTop />
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
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
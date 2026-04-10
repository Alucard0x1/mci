import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="bg-mci-amber text-white py-2 px-4 text-center text-sm font-bold relative z-50">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-2 md:gap-4 flex-wrap">
        <span className="flex items-center gap-2">
          <Calendar size={16} /> 
          <span className="uppercase tracking-wide text-xs md:text-sm">Now Enrolling</span>
        </span>
        <span className="hidden md:inline text-white/50">|</span>
        <span>August 2026 intake — Singapore. Online Modular & Foundation programs open.</span>
        <Link to="/calendar" className="inline-flex items-center gap-1 hover:underline decoration-white ml-2">
          View Schedule <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default TopBanner;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="bg-mci-amber text-mci-navy py-2 px-4 text-center text-sm font-bold relative z-50">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-2 md:gap-4 flex-wrap">
        <span className="flex items-center gap-2">
          <Clock size={16} /> 
          <span className="uppercase tracking-wide text-xs md:text-sm">Early Bird Offer</span>
        </span>
        <span className="hidden md:inline text-mci-navy/50">|</span>
        <span>Register for Q2 2026 sessions by Feb 28 to save 15%.</span>
        <Link to="/calendar" className="inline-flex items-center gap-1 hover:underline decoration-mci-navy ml-2">
          View Schedule <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default TopBanner;
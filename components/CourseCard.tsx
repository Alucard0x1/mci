import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart, ChevronRight, Calendar } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const nextSession = course.schedules.find(s => s.status !== 'Sold Out');

  return (
    <div className="group flex flex-col bg-white border border-mci-borderGrey rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 bg-mci-lightGrey text-mci-navy text-xs font-bold tracking-wider uppercase rounded-sm">
            {course.category}
          </span>
          <span className="text-mci-teal text-xs font-semibold">{course.code}</span>
        </div>
        
        <h3 className="text-xl font-bold text-mci-navy mb-3 group-hover:text-mci-teal transition-colors">
          <Link to={`/courses/${course.id}`}>
            {course.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
          {course.overview}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-mci-teal" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart size={14} className="text-mci-teal" />
            <span>{course.level}</span>
          </div>
        </div>

        {nextSession && (
          <div className="bg-mci-lightGrey/50 -mx-6 -mb-6 px-6 py-4 flex justify-between items-center mt-auto border-t border-gray-100 group-hover:bg-mci-lightGrey transition-colors">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-mci-navy">Next: {new Date(nextSession.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <span className="text-[10px] text-gray-500">{nextSession.location}</span>
              </div>
            </div>
            <Link 
              to={`/courses/${course.id}`} 
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-mci-navy group-hover:bg-mci-amber group-hover:border-mci-amber group-hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
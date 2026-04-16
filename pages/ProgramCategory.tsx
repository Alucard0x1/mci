import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Loader2, Clock, ChevronRight, BookOpen } from 'lucide-react';

const ProgramCategory = () => {
  const { categoryId } = useParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryMap: Record<string, string> = {
    'data-center': 'Data Center',
    'business-continuity': 'Business Continuity',
    'cybersecurity': 'Cybersecurity'
  };

  const categoryName = categoryId ? categoryMap[categoryId] : null;

  useEffect(() => {
    if (!categoryName) return;
    api.getCourses()
      .then(data => setCourses(data.filter((c: any) => c.program === categoryName)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryName]);

  if (!categoryName) {
    return <div className="p-20 text-center">Category not found</div>;
  }

  // Group by level
  const levels = ['Foundation', 'Continuing Education', 'Diploma', 'Advanced Diploma', 'Executive Diploma'];
  const grouped = levels.map(level => ({
    level,
    courses: courses.filter(c => c.level === level),
  })).filter(g => g.courses.length > 0);

  return (
    <div>
      <div className="bg-mci-maroon text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-2 block">Programs</span>
          <h1 className="text-4xl font-bold mb-4">Applied {categoryName} Program</h1>
          <p className="text-gray-300 max-w-2xl text-lg">
            Industry accredited qualifications for professionals specializing in {categoryName.toLowerCase()}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-mci-teal" /></div>
        ) : grouped.length > 0 ? (
          <div className="space-y-12">
            {grouped.map(group => (
              <div key={group.level}>
                <h2 className="text-lg font-bold text-mci-text uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-mci-maroon" /> {group.level}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.courses.map((course: any) => (
                    <Link key={course.id} to={`/courses/${course.id}`}
                      className="group bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:-translate-y-1 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-mono text-mci-teal font-bold">{course.code}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{course.format}</span>
                      </div>
                      <h3 className="font-bold text-mci-text text-sm mb-3 group-hover:text-mci-maroon transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                        {course.price > 0 && <span className="font-bold text-mci-text">USD {course.price}</span>}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                        <span className="text-mci-maroon text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details <ChevronRight size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-mci-lightGrey p-12 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Coming Soon</h3>
            <p className="text-gray-500">We are currently updating our course catalog for {categoryName}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCategory;

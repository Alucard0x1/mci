import React from 'react';
import { useParams } from 'react-router-dom';
import { COURSES } from '../constants';
import CourseCard from '../components/CourseCard';

const ProgramCategory = () => {
  const { categoryId } = useParams();
  
  // Basic mapping for URL param to Category Title
  const categoryMap: Record<string, string> = {
    'data-center': 'Data Center',
    'business-continuity': 'Business Continuity',
    'cybersecurity': 'Cybersecurity'
  };

  const categoryName = categoryId ? categoryMap[categoryId] : null;
  const filteredCourses = categoryName ? COURSES.filter(c => c.category === categoryName) : [];

  if (!categoryName) {
    return <div className="p-20 text-center">Category not found</div>;
  }

  return (
    <div>
      <div className="bg-mci-maroon text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-2 block">Programs</span>
          <h1 className="text-4xl font-bold mb-4">{categoryName} Training</h1>
          <p className="text-gray-300 max-w-2xl text-lg">
            Industry accredited qualifications for professionals specializing in {categoryName.toLowerCase()}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
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
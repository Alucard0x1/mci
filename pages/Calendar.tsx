import React, { useState } from 'react';
import { COURSES } from '../constants';
import { Link } from 'react-router-dom';
import { Filter, CheckCircle, AlertCircle } from 'lucide-react';

const Calendar = () => {
  // Flatten schedules to a list of events
  const allEvents = COURSES.flatMap(course => 
    course.schedules.map(schedule => ({
      ...schedule,
      courseTitle: course.title,
      courseId: course.id,
      category: course.category
    }))
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredEvents = allEvents.filter(event => {
    const typeMatch = filterType === 'All' || event.type === filterType;
    const catMatch = filterCategory === 'All' || event.category === filterCategory;
    return typeMatch && catMatch;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-mci-lightGrey py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-mci-navy mb-4">Training Calendar</h1>
          <p className="text-gray-600">View upcoming sessions across all disciplines.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 font-medium mr-4">
            <Filter size={20} />
            <span>Filter:</span>
          </div>
          
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-select block w-full md:w-auto border-gray-300 rounded-md shadow-sm focus:border-mci-teal focus:ring focus:ring-mci-teal/20 p-2 border"
          >
            <option value="All">All Categories</option>
            <option value="Data Center">Data Center</option>
            <option value="Business Continuity">Business Continuity</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>

          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select block w-full md:w-auto border-gray-300 rounded-md shadow-sm focus:border-mci-teal focus:ring focus:ring-mci-teal/20 p-2 border"
          >
            <option value="All">All Formats</option>
            <option value="Classroom">Classroom</option>
            <option value="Virtual">Virtual</option>
          </select>

           <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Guaranteed</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Limited</span>
           </div>
        </div>

        {/* Table/List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Course</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Format</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={`${event.id}-${event.courseId}`} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-5 hover:bg-gray-50 transition-colors group items-center">
                  
                  {/* Date */}
                  <div className="col-span-2 flex md:block items-center gap-2">
                    <span className="md:hidden text-gray-400 text-xs uppercase font-bold w-20">Date:</span>
                    <div>
                      <span className="block font-bold text-mci-navy">{new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <span className="text-xs text-gray-500">{new Date(event.startDate).getFullYear()}</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <div className="col-span-4">
                     <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded mb-1">
                       {event.category}
                     </span>
                     <Link to={`/courses/${event.courseId}`} className="block font-bold text-mci-navy group-hover:text-mci-teal transition-colors">
                       {event.courseTitle}
                     </Link>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 flex md:block items-center gap-2">
                     <span className="md:hidden text-gray-400 text-xs uppercase font-bold w-20">Location:</span>
                     <span className="text-sm text-gray-700">{event.location}</span>
                  </div>

                  {/* Format */}
                  <div className="col-span-2 flex md:block items-center gap-2">
                     <span className="md:hidden text-gray-400 text-xs uppercase font-bold w-20">Format:</span>
                     <span className="text-sm text-gray-700">{event.type}</span>
                  </div>

                  {/* Status/Action */}
                  <div className="col-span-2 flex justify-between md:justify-end items-center w-full">
                    {event.status === 'Guaranteed' && (
                       <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full mr-3">
                         <CheckCircle size={12} /> GTR
                       </span>
                    )}
                    {event.status === 'Limited' && (
                       <span className="flex items-center gap-1 text-orange-500 text-xs font-bold bg-orange-50 px-2 py-1 rounded-full mr-3">
                         <AlertCircle size={12} /> Few Seats
                       </span>
                    )}
                    
                    {event.status === 'Sold Out' ? (
                      <span className="text-gray-400 font-bold text-sm">Sold Out</span>
                    ) : (
                      <Link 
                        to={`/courses/${event.courseId}`} 
                        className="bg-mci-navy hover:bg-mci-teal text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                      >
                        Book
                      </Link>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                No sessions match your filters. <button onClick={() => {setFilterCategory('All'); setFilterType('All')}} className="text-mci-teal font-bold underline">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
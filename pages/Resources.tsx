import React, { useState } from 'react';
import { RESOURCES } from '../constants';
import { FileText, Video, ArrowRight, PlayCircle, BookOpen } from 'lucide-react';

const Resources = () => {
  const [filter, setFilter] = useState('All');

  const filteredResources = filter === 'All' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.category === filter);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-mci-lightGrey py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-4xl font-bold text-mci-navy mb-4">Insights & Resources</h1>
           <p className="text-gray-600 max-w-2xl">
             Expert analysis, whitepapers, and webinars on the latest trends in critical infrastructure.
           </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-200 pb-4">
          {['All', 'Data Center', 'Business Continuity', 'Cybersecurity'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                ? 'bg-mci-navy text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map(resource => (
            <div key={resource.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full hover:-translate-y-1">
               <div className="relative h-48 overflow-hidden">
                 <img 
                   src={resource.imageUrl} 
                   alt={resource.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide bg-white/90 shadow-sm ${
                      resource.type === 'Webinar' ? 'text-purple-700' : 'text-blue-700'
                    }`}>
                      {resource.type}
                    </span>
                 </div>
               </div>
               
               <div className="p-6 flex flex-col flex-grow">
                 <div className="text-gray-400 text-xs font-medium mb-3">{resource.date}</div>
                 <h3 className="text-xl font-bold text-mci-navy mb-3 line-clamp-2 group-hover:text-mci-teal transition-colors">{resource.title}</h3>
                 <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{resource.summary}</p>
                 
                 <a href="#" className="inline-flex items-center gap-2 text-mci-navy font-bold text-sm animated-link mt-auto">
                   {resource.type === 'Webinar' ? 'Watch Now' : 'Read Article'} <ArrowRight size={16} />
                 </a>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
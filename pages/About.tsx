import React from 'react';
import { INSTRUCTORS } from '../constants';
import { Target, Users, Globe, Play } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-mci-maroon text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <span className="text-mci-amber font-bold text-sm uppercase tracking-widest mb-4 block">Our Institution</span>
           <h1 className="text-4xl md:text-5xl font-bold mb-6">About MCI Training</h1>
           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
             Dedicated to building global resilience through expert-led education in critical infrastructure.
           </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-mci-maroon/10 text-mci-text rounded-full flex items-center justify-center mx-auto mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold text-mci-text mb-4">Our Mission</h3>
            <p className="text-gray-600">To bridge the gap between theoretical standards and practical application, ensuring professionals are ready for real-world crises.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-mci-maroon/10 text-mci-text rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-mci-text mb-4">Global Standards</h3>
            <p className="text-gray-600">We adhere strictly to international frameworks including ISO, EN, TIA, and NIST to ensure your certification is recognized worldwide.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-mci-maroon/10 text-mci-text rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-mci-text mb-4">Expert Faculty</h3>
            <p className="text-gray-600">Our instructors aren't just teachers; they are active consultants and auditors with decades of field experience.</p>
          </div>
        </div>
      </div>

      {/* Video Testimonials Section */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row gap-16 items-center">
             <div className="flex-1">
               <span className="text-mci-teal font-bold text-sm uppercase tracking-widest mb-2 block">Student Stories</span>
               <h2 className="text-3xl font-bold text-mci-text mb-6">Hear from our Alumni</h2>
               <p className="text-gray-600 text-lg mb-8">
                 "MCI's training wasn't just about passing an exam. The practical exercises in BCM implementation helped me navigate a real ransomware attack just 3 months later. It's not an exaggeration to say this training saved our quarter."
               </p>
               <div>
                  <div className="font-bold text-mci-text text-lg">David R.</div>
                  <div className="text-gray-500">Chief Risk Officer, FinTech Global</div>
               </div>
             </div>
             
             <div className="flex-1 relative group cursor-pointer w-full">
               <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                     <div className="w-16 h-16 bg-mci-amber rounded-full flex items-center justify-center shadow-lg">
                       <Play size={32} className="text-white ml-1" fill="white" />
                     </div>
                   </div>
                 </div>
               </div>
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-dots-pattern opacity-20"></div>
             </div>
           </div>
        </div>
      </div>

      {/* Instructor Showcase */}
      <div className="bg-mci-lightGrey py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-mci-text mb-4">Meet Our Faculty</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Learn from the architects and auditors who shape the industry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(INSTRUCTORS).map(instructor => (
              <div key={instructor.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <img src={instructor.imageUrl} alt={instructor.name} className="w-20 h-20 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-mci-text text-lg">{instructor.name}</h3>
                    <p className="text-mci-teal text-sm font-medium">{instructor.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {instructor.bio}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                   <button className="text-mci-text text-sm font-bold hover:text-mci-teal transition-colors">View Full Profile &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
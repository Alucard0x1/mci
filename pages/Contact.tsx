import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, X, Loader2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'General Enquiry',
    message: ''
  });
  
  // Validation State tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation Logic
  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name' && value.length < 2) error = 'Name must be at least 2 characters';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
    if (name === 'message' && value.length < 10) error = 'Message must be at least 10 characters';
    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error if user starts typing after an error
    if (touched[name]) {
       setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key as keyof typeof formData]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, message: true, type: true });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call with spinner
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Helper to render Validation Icon
  const renderValidationIcon = (fieldName: string) => {
    if (!touched[fieldName]) return null;
    if (errors[fieldName]) return <X size={18} className="text-red-500 absolute right-3 top-3.5" />;
    return <Check size={18} className="text-green-500 absolute right-3 top-3.5" />;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-mci-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Get in touch with our admissions team or request a quote for corporate training.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div>
            <h2 className="text-2xl font-bold text-mci-navy mb-8">Get in Touch</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-mci-lightGrey p-3 rounded-full text-mci-teal">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-mci-navy">Phone</h3>
                  <p className="text-gray-600">+44 20 1234 5678</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9am - 6pm GMT</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-mci-lightGrey p-3 rounded-full text-mci-teal">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-mci-navy">Email</h3>
                  <p className="text-gray-600">admissions@mci-training.com</p>
                  <p className="text-gray-600">corporate@mci-training.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-mci-lightGrey p-3 rounded-full text-mci-teal">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-mci-navy">Headquarters</h3>
                  <p className="text-gray-600">
                    123 Innovation Drive<br />
                    Tech Park, London<br />
                    United Kingdom
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-mci-lightGrey p-8 rounded-lg">
              <h3 className="font-bold text-mci-navy mb-2">For Current Students</h3>
              <p className="text-gray-600 text-sm mb-4">Access the learning portal for course materials and exam schedules.</p>
              <a href="#" className="text-mci-teal font-bold hover:underline animated-link">Log in to Student Portal &rarr;</a>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="type" className="block text-sm font-bold text-mci-navy mb-2">Enquiry Type</label>
                  <div className="relative">
                    <select 
                      id="type"
                      name="type"
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:border-mci-teal focus:ring focus:ring-mci-teal/20 outline-none"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option>General Enquiry</option>
                      <option>Course Application</option>
                      <option>Corporate Training Quote</option>
                      <option>Partnership Opportunity</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-mci-navy mb-2">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      className={`w-full border rounded-md shadow-sm p-3 focus:outline-none focus:ring-1 ${
                        touched.name && errors.name 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                          : touched.name && !errors.name
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
                          : 'border-gray-300 focus:border-mci-teal focus:ring-mci-teal/20'
                      }`}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {renderValidationIcon('name')}
                  </div>
                  {touched.name && errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-mci-navy mb-2">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      className={`w-full border rounded-md shadow-sm p-3 focus:outline-none focus:ring-1 ${
                        touched.email && errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                          : touched.email && !errors.email
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
                          : 'border-gray-300 focus:border-mci-teal focus:ring-mci-teal/20'
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {renderValidationIcon('email')}
                  </div>
                  {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-mci-navy mb-2">Message</label>
                  <div className="relative">
                    <textarea 
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className={`w-full border rounded-md shadow-sm p-3 focus:outline-none focus:ring-1 ${
                        touched.message && errors.message 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                          : touched.message && !errors.message
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50'
                          : 'border-gray-300 focus:border-mci-teal focus:ring-mci-teal/20'
                      }`}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                     {renderValidationIcon('message')}
                  </div>
                  {touched.message && errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-mci-amber hover:brightness-110 text-white font-bold py-3 rounded shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center py-12 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-mci-navy mb-2">Message Sent</h3>
                <p className="text-gray-600">Thank you for your enquiry. Our team will get back to you within 24 hours.</p>
                <button 
                  onClick={() => {
                    setIsSubmitted(false); 
                    setFormData({...formData, message: '', name: '', email: ''}); 
                    setTouched({});
                    setErrors({});
                  }}
                  className="mt-8 text-mci-teal font-bold hover:underline animated-link"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
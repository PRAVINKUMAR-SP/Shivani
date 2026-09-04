import React, { useState } from 'react';
import { Phone, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setStatus({ loading: false, success: false, error: data.error || 'Failed to send message' });
      }
    } catch (error) {
      console.error('Failed to send contact message:', error);
      setStatus({ loading: false, success: false, error: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#f8f9fc] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        
        {status.success && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100">
            Message sent successfully! We will get back to you soon.
          </div>
        )}

        {status.error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Business Inquiry"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
            <textarea
              name="message"
              required
              rows="4"
              placeholder="Tell us about your project requirements..."
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full flex items-center justify-center gap-2 bg-[#5c5cd6] hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status.loading ? 'Sending...' : 'Send Message'}
            {!status.loading && <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

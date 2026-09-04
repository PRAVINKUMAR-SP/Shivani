import React, { useState } from 'react';
import { Phone, Send, MapPin, Mail } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-100px)] bg-[#f8f9fc] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

        {/* Left Side: Text and Info */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Get in <span className="text-indigo-600">Touch</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-lg">
              Have a question about our platform, pricing, or looking to partner with us? Our dedicated support team is here to help you every step of the way. Fill out the form or give us a call.
            </p>
          </div>

          <div className="flex flex-col gap-8 mt-4">
            
            <div className="flex items-start gap-5 px-2">
              <div className="w-14 h-14 bg-indigo-50/80 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="w-6 h-6 text-indigo-600 fill-indigo-600/20" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-[18px] mb-1.5">Our Location</h3>
                <p className="text-gray-500 font-medium text-[15px] leading-relaxed max-w-[320px]">
                  Shivani Technologies, old No.36, New No.109, Third Floor, No.3C MTH Road, DL Complex, Villivakkam, Chennai-600 049
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 px-2">
              <div className="w-14 h-14 bg-indigo-50/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-indigo-600 fill-indigo-600/20" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-[18px] mb-1">Email Us</h3>
                <p className="text-gray-500 font-medium text-[15px]">Hr@shivanitech.in</p>
              </div>
            </div>

            <div className="flex items-center gap-5 px-2">
              <div className="w-14 h-14 bg-indigo-50/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-indigo-600 fill-indigo-600/20" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-[18px] mb-1">Call Support</h3>
                <p className="text-gray-500 font-medium text-[15px] tracking-wide">+91 97907 04999</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

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

            <form onSubmit={handleSubmit} className="space-y-3">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Business Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  required
                  rows="3"
                  placeholder="Tell us about your project requirements..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-700 font-medium resize-none text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full flex items-center justify-center gap-2 bg-[#5c5cd6] hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status.loading ? 'Sending...' : 'Send Message'}
                {!status.loading && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

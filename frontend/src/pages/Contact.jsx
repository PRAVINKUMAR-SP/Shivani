import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4 tracking-tight">Contact Us</h1>
        <p className="text-gray-500 mb-10 text-lg">We'd love to hear from you. Please reach out with any questions or feedback.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600">support@shivanitech.com</p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Office</h3>
            <p className="text-sm text-gray-600">123 Tech Blvd, Silicon Valley, CA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

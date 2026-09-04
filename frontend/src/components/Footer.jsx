import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  
  // Don't show footer on dashboard pages where we have a sticky sidebar layout
  const hideFooterRoutes = ['/dashboard', '/employer', '/admin'];
  const shouldHide = hideFooterRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHide) return null;

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">SHIVANI TECHNOLOGIES</span>
          </Link>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-xs">
            Empowering careers and connecting top talent with industry-leading companies globally. Your dream job is just a click away.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/companies" className="hover:text-blue-400 transition-colors">Top Companies</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition-colors">Our Services</Link></li>
            <li><Link to="/financial" className="hover:text-blue-400 transition-colors">Financial Tools</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Trust & Safety</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>123 Tech Park, Innovation Hub<br />Silicon Valley, CA 94025</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <a href="mailto:support@shivanitech.com" className="hover:text-blue-400 transition-colors">support@shivanitech.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-sm text-center text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Shivani Technologies. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Built with precision</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

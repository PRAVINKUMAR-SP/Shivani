import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-gray-50 sticky top-0 z-50">
      <nav className="bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] border-b-[3px] border-gray-100 w-full relative z-50 rounded-2xl">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-4 mr-4">
              <img src="/logo.png" alt="Shivani Technologies Logo" className="h-16 w-auto object-contain" />
              <span className="font-bold text-2xl tracking-tight text-blue-700">SHIVANI TECHNOLOGIES</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-10">
              <Link to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium transition-colors ${isActive('/') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                Jobs
              </Link>
              <Link to="/companies" className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium transition-colors ${isActive('/companies') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                Companies
              </Link>
              <Link to="/services" className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium transition-colors ${isActive('/services') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                Services
              </Link>
              <Link to="/financial" className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium transition-colors ${isActive('/financial') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                Financial
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3 bg-gray-50 py-1.5 px-2 rounded-full border border-gray-100 shadow-sm">
                <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
                <span className="font-bold text-slate-700 text-[15px] pr-2">{user.given_name || user.name}</span>
                <button onClick={logout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors mr-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="text-blue-600 font-bold text-lg hover:underline px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">Sign in</button>
            )}
          </div>
        </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Navbar;

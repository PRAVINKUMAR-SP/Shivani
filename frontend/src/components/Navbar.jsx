import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-gray-50 sticky top-0 z-50">
      <nav className="bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] border-b-[3px] border-gray-100 w-full relative z-50 rounded-2xl">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-4 mr-4">
              <img src="/logo.png" alt="Shivani Technologies Logo" className="h-10 sm:h-16 w-auto object-contain" />
              <span className="font-bold text-lg sm:text-2xl tracking-tight text-blue-700 whitespace-nowrap">SHIVANI TECHNOLOGIES</span>
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
              <button onClick={openLoginModal} className="text-blue-600 font-bold text-lg hover:underline px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">Sign in</button>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4 px-2 pt-2 pb-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Jobs</Link>
              <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/companies') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Companies</Link>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/services') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Services</Link>
              <Link to="/financial" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/financial') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Financial</Link>
              
              <div className="border-t border-gray-100 pt-4 mt-2">
                {user ? (
                  <div className="flex items-center justify-between px-3">
                    <div className="flex items-center gap-3">
                      <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
                      <span className="font-bold text-slate-700">{user.given_name || user.name}</span>
                    </div>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-medium">Log out</button>
                  </div>
                ) : (
                  <button onClick={() => { openLoginModal(); setIsMobileMenuOpen(false); }} className="w-full text-center text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-lg">Sign in</button>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default Navbar;

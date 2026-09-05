import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, ShieldCheck } from 'lucide-react';
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
              <Link to="/contact" className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium transition-colors ${isActive('/contact') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                {user.email === 'pravin007ptk@gmail.com' || user.role === 'ADMIN' ? (
                  location.pathname.startsWith('/admin') ? (
                    <Link
                      to="/employer/dashboard"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors mr-4 text-sm flex items-center gap-2 shadow-sm"
                    >
                      <Briefcase className="w-4 h-4" />
                      Employer
                    </Link>
                  ) : (
                    <Link
                      to="/admin/dashboard"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-colors mr-4 text-sm flex items-center gap-2 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </Link>
                  )
                ) : user.role === 'EMPLOYER' ? (
                  <Link
                    to="/employer/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors mr-4 text-sm flex items-center gap-2 shadow-sm"
                  >
                    <Briefcase className="w-4 h-4" />
                    Employer
                  </Link>
                ) : null}
                <Link to="/dashboard" className="block w-10 h-10 rounded-full border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all">
                  <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full rounded-full object-cover" />
                </Link>
              </>
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
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>Contact Us</Link>
              
              <div className="border-t border-gray-100 pt-4 mt-2">
                {user ? (
                  <>
                    {user.email === 'pravin007ptk@gmail.com' || user.role === 'ADMIN' ? (
                      location.pathname.startsWith('/admin') ? (
                        <Link
                          to="/employer/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2"
                        >
                          <Briefcase className="w-4 h-4" />
                          Employer
                        </Link>
                      ) : (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin
                        </Link>
                      )
                    ) : user.role === 'EMPLOYER' ? (
                      <Link
                        to="/employer/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2"
                      >
                        <Briefcase className="w-4 h-4" />
                        Employer
                      </Link>
                    ) : null}
                    <div className="flex items-center justify-between px-3">
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                        <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
                        <span className="font-bold text-slate-700">{user.given_name || user.name}</span>
                      </Link>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-medium">Log out</button>
                    </div>
                  </>
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

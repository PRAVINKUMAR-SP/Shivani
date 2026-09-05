import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  PlusCircle, 
  Settings, 
  User,
  Users,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EmployerSidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/employer/dashboard' },
    { name: 'Post a Job', icon: PlusCircle, path: '/employer/post-job' },
    { name: 'My Listings', icon: Briefcase, path: '/employer/jobs' },
    { name: 'Applicants', icon: Users, path: '/employer/applicants' },
    { name: 'Profile Settings', icon: Settings, path: '/employer/settings' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden fixed left-0 top-32 z-[40] bg-blue-600 text-white w-12 h-12 rounded-r-lg shadow-lg flex items-center justify-center"
        >
          <Settings className="w-6 h-6 animate-[spin_3s_linear_infinite]" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-32 bg-black/50 z-[90] lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:sticky top-32 lg:top-24 left-0 z-[100] lg:z-30 h-[calc(100vh-128px)] lg:h-full w-64 bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col pt-8 pb-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex-1 px-4 space-y-2 flex flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/employer/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-blue-600 font-semibold'
              }`
            }
          >
            <item.icon className="w-5 h-5" strokeWidth={2.5} />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="px-4 mt-auto flex items-center">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-red-600 hover:bg-red-50 font-semibold mt-4 border border-transparent hover:border-red-100 whitespace-nowrap"
        >
          <LogOut className="w-5 h-5" strokeWidth={2.5} />
          Logout
        </button>
      </div>
      </div>
    </>
  );
};

export default EmployerSidebar;

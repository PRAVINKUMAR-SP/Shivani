import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Briefcase, Settings, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
    { name: 'Test Results', icon: FileText, path: '/admin/tests' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
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
        fixed lg:sticky top-32 lg:top-24 left-0 z-[100] lg:z-30 h-[calc(100vh-128px)] lg:h-full w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col py-8 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex-1 space-y-2 flex flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium whitespace-nowrap ${
                isActive 
                  ? 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} 
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto flex items-center">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 whitespace-nowrap"
        >
          <LogOut className="w-5 h-5 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
          Logout
        </button>
      </div>
      </div>
    </>
  );
};

export default AdminSidebar;

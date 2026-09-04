import React from 'react';
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
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/employer/dashboard' },
    { name: 'Post a Job', icon: PlusCircle, path: '/employer/post-job' },
    { name: 'My Listings', icon: Briefcase, path: '/employer/jobs' },
    { name: 'Applicants', icon: Users, path: '/employer/applicants' },
    { name: 'Profile Settings', icon: Settings, path: '/employer/settings' },
  ];

  return (
    <div className="h-full w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col pt-8 pb-4 sticky top-24">
      <div className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/employer/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
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

      <div className="px-4 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-red-600 hover:bg-red-50 font-semibold mt-4 border border-transparent hover:border-red-100"
        >
          <LogOut className="w-5 h-5" strokeWidth={2.5} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployerSidebar;

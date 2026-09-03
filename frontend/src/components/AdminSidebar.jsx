import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Briefcase, Settings } from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col py-8 px-4 w-64 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} 
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;

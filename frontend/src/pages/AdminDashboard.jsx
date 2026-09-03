import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Briefcase } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <AdminSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Welcome back, {user?.name || 'Admin'}. Manage platform users and jobs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Platform Users</p>
                <p className="text-2xl font-bold text-gray-900">Manage Users</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
              <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Job Listings</p>
                <p className="text-2xl font-bold text-gray-900">Manage Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <ShieldCheck className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Controls</h3>
            <p className="text-gray-500 mb-6 max-w-md">Additional administrative features and analytics will appear here.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

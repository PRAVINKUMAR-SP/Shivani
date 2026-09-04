import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { Settings, Save, ShieldAlert } from 'lucide-react';

const AdminSettings = () => {
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
                <Settings className="w-8 h-8 text-blue-600" />
                Admin Settings
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Manage platform configurations and global preferences.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
             <ShieldAlert className="w-16 h-16 text-yellow-500 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Settings</h3>
             <p className="text-gray-500 mb-6 max-w-md text-center">Global platform configurations (like featured jobs, email templates, and API keys) are currently managed via the backend configuration files.</p>
             <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-xl border border-blue-100">
               Coming Soon: In-app dynamic configuration controls.
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

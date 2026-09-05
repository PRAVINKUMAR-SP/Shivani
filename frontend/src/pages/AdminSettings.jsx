import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { Settings, Save, ShieldAlert, Users, Server, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: false,
    maxJobsPerEmployer: '50',
    platformFee: '5',
    adminEmailAlerts: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Admin settings saved successfully!');
    }, 800);
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <AdminSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-5xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <Settings className="w-8 h-8 text-blue-600" />
                Admin Settings
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Manage platform configurations and global preferences.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm disabled:bg-blue-400"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>

          <div className="space-y-6">
            {/* System Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Server className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">System Controls</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Maintenance Mode</h4>
                    <p className="text-sm text-gray-500">Disable access to the platform for all non-admin users.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('maintenanceMode')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* User Registration */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">User Registration</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Allow New Registrations</h4>
                    <p className="text-sm text-gray-500">Allow new users to create accounts on the platform.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('allowNewRegistrations')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowNewRegistrations ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.allowNewRegistrations ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-900">Require Email Verification</h4>
                    <p className="text-sm text-gray-500">Force users to verify their email before applying to jobs.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('requireEmailVerification')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.requireEmailVerification ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Limits & Fees */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Limits & Configuration</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-gray-900 mb-2">Max Jobs Per Employer</label>
                  <input 
                    type="number" 
                    value={settings.maxJobsPerEmployer}
                    onChange={(e) => setSettings({...settings, maxJobsPerEmployer: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Limit active listings per employer account</p>
                </div>
                <div>
                  <label className="block font-bold text-gray-900 mb-2">Platform Fee (%)</label>
                  <input 
                    type="number" 
                    value={settings.platformFee}
                    onChange={(e) => setSettings({...settings, platformFee: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage fee for premium employer features</p>
                </div>
              </div>
            </div>

            {/* Admin Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Admin Notifications</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">Receive System Alerts</h4>
                    <p className="text-sm text-gray-500">Get emails for platform errors, new employer signups, and reports.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('adminEmailAlerts')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.adminEmailAlerts ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.adminEmailAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

import React, { useState } from 'react';
import EmployerSidebar from '../components/EmployerSidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Shield, Eye, Trash2, Building } from 'lucide-react';

const EmployerSettings = () => {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState({
    emailAlerts: true,
    applicantNotifications: true,
    companyProfileVisibility: 'public',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex flex-col lg:flex-row relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="lg:w-64 flex-shrink-0 relative z-30">
        <EmployerSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-4xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Employer Settings</h2>
            <p className="text-gray-500 mt-1 font-medium">Manage your company preferences and account security</p>
          </div>

          {!user ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              Please log in to view your settings.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Notification Preferences */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">Email Alerts</h4>
                      <p className="text-sm text-gray-500">Receive emails about new features and updates</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('emailAlerts')}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.emailAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <h4 className="font-bold text-gray-900">Applicant Notifications</h4>
                      <p className="text-sm text-gray-500">Get notified when candidates apply to your jobs</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('applicantNotifications')}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.applicantNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.applicantNotifications ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Profile Privacy */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Company Privacy</h3>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Company Visibility</h4>
                  <p className="text-sm text-gray-500 mb-4">Control how your company profile appears in search results</p>
                  
                  <select 
                    value={settings.companyProfileVisibility}
                    onChange={(e) => setSettings({...settings, companyProfileVisibility: e.target.value})}
                    className="w-full md:w-1/2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors p-3 border"
                  >
                    <option value="public">Public (Visible to all candidates)</option>
                    <option value="private">Private (Only visible to invited candidates)</option>
                  </select>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="p-6 border-b border-red-100 flex items-center gap-3 bg-red-50/30">
                  <Shield className="w-5 h-5 text-red-600" />
                  <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                </div>
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900">Delete Employer Account</h4>
                    <p className="text-sm text-gray-500">Permanently delete your company account and all job postings</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-xl transition-colors border border-red-100 hover:border-transparent">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerSettings;

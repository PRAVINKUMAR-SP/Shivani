import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AppliedJobs = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/applications/user/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        }
      } catch (error) {
        console.error('Failed to fetch applied jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user]);

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        {/* Jobs Grid */}
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Applied Jobs</h2>
              <p className="text-gray-500 mt-1 font-medium">Track the status of your job applications</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {!user ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                Please log in to view your applied jobs.
              </div>
            ) : loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : applications.length > 0 ? (
              applications.map((application) => (
                <div key={application.id} className="relative">
                  <JobCard job={application.job} />
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {application.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6 max-w-md">You haven't applied to any jobs yet. Start exploring and find your dream role!</p>
                <Link to="/dashboard" className="bg-[#0b5cff] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm">
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;

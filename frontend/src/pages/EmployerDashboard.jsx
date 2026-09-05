import React, { useState, useEffect } from 'react';
import EmployerSidebar from '../components/EmployerSidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Star, PlusCircle } from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeListings: 0, totalApplicants: 0, shortlisted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/jobs/employer/${user.email}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch employer stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="bg-gray-50/50 dark:bg-slate-900 h-[calc(100vh-128px)] flex flex-col lg:flex-row relative overflow-hidden transition-colors duration-200">
      <div className="bg-blue-50/50 dark:bg-slate-800/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none transition-colors duration-200"></div>
      
      <div className="lg:w-64 flex-shrink-0 relative z-30">
        <EmployerSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Employer Dashboard</h1>
              <p className="text-gray-500 mt-2 font-medium">Welcome back, {user?.name || 'Employer'}. Manage your job listings and applicants.</p>
            </div>
            <Link to="/employer/post-job" className="hidden sm:flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm">
              <PlusCircle className="w-5 h-5" />
              Post a New Job
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <span className="animate-pulse inline-block w-8 h-6 bg-gray-200 rounded"></span> : stats.activeListings}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <span className="animate-pulse inline-block w-8 h-6 bg-gray-200 rounded"></span> : stats.totalApplicants}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <span className="animate-pulse inline-block w-8 h-6 bg-gray-200 rounded"></span> : stats.shortlisted}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to hire?</h3>
            <p className="text-gray-500 mb-6 max-w-md">You haven't posted any jobs yet. Create your first listing to start receiving applications.</p>
            <Link to="/employer/post-job" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Create Job Listing
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

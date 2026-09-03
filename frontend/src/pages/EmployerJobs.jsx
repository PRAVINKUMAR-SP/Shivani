import React, { useState, useEffect } from 'react';
import EmployerSidebar from '../components/EmployerSidebar';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';

const EmployerJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/jobs/employer/${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <EmployerSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Listings</h1>
              <p className="text-gray-500 mt-2 font-medium">Manage all the jobs you have posted.</p>
            </div>
            <Link to="/employer/post-job" className="hidden sm:flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm">
              <PlusCircle className="w-5 h-5" />
              Post a New Job
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="relative group">
                  <JobCard job={job} applied={false} saved={false} />
                  {/* Overlay for employer actions */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-xs font-bold text-gray-500 px-2">Posted Job</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                <div className="bg-blue-50 p-6 rounded-full text-blue-600 mb-4">
                  <Search className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs listed yet</h3>
                <p className="text-gray-500 mb-8 max-w-md">You haven't posted any jobs. Create your first listing to start receiving applications from talented candidates.</p>
                <Link to="/employer/post-job" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Post Your First Job
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployerJobs;

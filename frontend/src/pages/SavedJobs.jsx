import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const [savedRes, appliedRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/saved-jobs/user/${user.email}`),
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/applications/user/${user.email}`)
        ]);
        
        if (savedRes.ok) {
          const data = await savedRes.json();
          setSavedJobs(data);
        }
        
        if (appliedRes.ok) {
          const data = await appliedRes.json();
          setAppliedJobs(new Set(data.map(app => app.job.id)));
        }
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  // Remove a job from UI immediately if unsaved
  const handleUnsave = (jobId) => {
    setSavedJobs(prev => prev.filter(sj => sj.job.id !== jobId));
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex flex-col lg:flex-row relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="lg:w-64 flex-shrink-0 relative z-30">
        <Sidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Saved Jobs</h2>
              <p className="text-gray-500 mt-1 font-medium">Jobs you've bookmarked for later</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {!user ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                Please log in to view your saved jobs.
              </div>
            ) : loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : savedJobs.length > 0 ? (
              savedJobs.map((savedJob) => (
                <div key={savedJob.id} className="relative">
                  <JobCard 
                    job={savedJob.job} 
                    applied={appliedJobs.has(savedJob.job.id)} 
                    saved={true} 
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">No saved jobs</h3>
                <p className="text-gray-500 mb-6 max-w-md">You haven't saved any jobs yet. Bookmark jobs you are interested in to find them easily later.</p>
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

export default SavedJobs;

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '', workModes: [] });

  useEffect(() => {
    if (user?.email) {
      const fetchUserJobs = async () => {
        try {
          const [appliedRes, savedRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/applications/user/${user.email}`),
            fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/saved-jobs/user/${user.email}`)
          ]);
          
          if (appliedRes.ok) {
            const data = await appliedRes.json();
            setAppliedJobs(new Set(data.map(app => app.job.id)));
          }
          if (savedRes.ok) {
            const data = await savedRes.json();
            setSavedJobs(new Set(data.map(sj => sj.job.id)));
          }
        } catch (error) {
          console.error("Failed to fetch user job states", error);
        }
      };
      fetchUserJobs();
    }
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/jobs`;
        const params = new URLSearchParams();
        if (searchParams.keyword) params.append('search', searchParams.keyword);
        if (searchParams.location) params.append('location', searchParams.location);
        if (searchParams.workModes && searchParams.workModes.length > 0) {
          params.append('workModes', searchParams.workModes.join(','));
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const handleSearch = (keyword, location, filters = {}) => {
    setSearchParams(prev => ({ ...prev, keyword, location, ...filters }));
  };
  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col relative z-20 h-full">
        <div className="pt-8 flex-shrink-0">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {/* Jobs Grid */}
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Recommended Jobs</h2>
              <p className="text-gray-500 mt-1 font-medium">Based on your profile and preferences</p>
            </div>
            <a href="#" className="text-blue-600 font-bold hover:underline">View all</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} applied={appliedJobs.has(job.id)} saved={savedJobs.has(job.id)} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                No jobs found. Try adjusting your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

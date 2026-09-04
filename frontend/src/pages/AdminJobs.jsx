import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/admin/jobs`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
                <Briefcase className="w-8 h-8 text-blue-600" />
                Job Listings
              </h1>
              <p className="text-gray-500 mt-2 font-medium">View and manage all jobs posted on the platform.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-semibold">
                    <th className="py-4 px-6">Job Title & Company</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Type & Salary</th>
                    <th className="py-4 px-6 text-center">Applicants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-500">
                        <div className="flex justify-center mb-4">
                           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        Loading jobs...
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-500">
                        No jobs found.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <Link to={`/jobs/${job.id}`} className="block">
                            <span className="font-bold text-blue-600 hover:underline">{job.title}</span>
                            <div className="text-sm text-gray-500 mt-1 font-medium">{job.company}</div>
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {job.location}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 w-fit">
                              <Calendar className="w-3.5 h-3.5" />
                              {job.type || 'Full-time'}
                            </span>
                            <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              {job.salary || 'Not specified'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm font-bold gap-1.5">
                            <Users className="w-4 h-4" />
                            {job.applicantCount || 0}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminJobs;

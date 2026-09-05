import React, { useState, useEffect } from 'react';
import EmployerSidebar from '../components/EmployerSidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, MapPin, IndianRupee, Users, Trash2, Eye, Calendar } from 'lucide-react';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'New';
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now - posted;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return diffHours === 1 ? '1h ago' : `${diffHours}h ago`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};

const EmployerJobCard = ({ job, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/jobs/${job.id}`, {
        method: 'DELETE'
      });
      if (res.ok || res.status === 204) { onDelete(job.id); }
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleting(false);
    }
  };

  const postedDate = formatTimeAgo(job.postedAt);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link to={`/jobs/${job.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {job.title}
          </Link>
          <p className="text-gray-500 text-sm font-medium mt-0.5">{job.company}</p>
        </div>
        <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
          {job.type || 'Full-time'}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{job.location}</span>
        {job.salary && <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-gray-400" />{job.salary?.replace(/\$/g, '₹')}</span>}
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />{postedDate}</span>
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
          <Users className="w-4 h-4 text-blue-500" />
          {job.applicantCount || 0} Applicant{job.applicantCount !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <Link to={`/jobs/${job.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
            <Eye className="w-3.5 h-3.5" /> View
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              confirmDelete
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'text-red-500 bg-red-50 hover:bg-red-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? 'Deleting...' : confirmDelete ? 'Confirm?' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployerJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/jobs/employer/${user.email}`);
        if (res.ok) setJobs(await res.json());
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  const handleDelete = (deletedId) => {
    setJobs(prev => prev.filter(j => j.id !== deletedId));
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none" />

      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <EmployerSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">

          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Listings</h1>
              <p className="text-gray-500 mt-2 font-medium">
                Manage all the jobs you have posted.{' '}
                <span className="font-bold text-blue-600">{jobs.length} total</span>
              </p>
            </div>
            <Link to="/employer/post-job" className="hidden sm:flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm">
              <PlusCircle className="w-5 h-5" />
              Post a New Job
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <EmployerJobCard key={job.id} job={job} onDelete={handleDelete} />
              ))
            ) : (
              <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                <div className="bg-blue-50 p-6 rounded-full text-blue-600 mb-4">
                  <Search className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs listed yet</h3>
                <p className="text-gray-500 mb-8 max-w-md">You haven't posted any jobs. Create your first listing to start receiving applications.</p>
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

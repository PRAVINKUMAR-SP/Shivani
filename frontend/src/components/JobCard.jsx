import React, { useState, useEffect } from 'react';
import { MapPin, IndianRupee, Clock, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

const JobCard = ({ job, applied, saved: initialSaved }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(initialSaved || false);

  useEffect(() => {
    if (initialSaved !== undefined) {
      setIsSaved(initialSaved);
    }
  }, [initialSaved]);

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please log in to save jobs");
      return;
    }
    
    // Optimistic UI update
    setIsSaved(!isSaved);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/saved-jobs/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          jobId: job.id
        })
      });
      
      if (!response.ok) {
        // Revert on failure
        setIsSaved(isSaved);
        console.error('Failed to toggle save status');
      }
    } catch (error) {
      setIsSaved(isSaved);
      console.error('Error toggling save status:', error);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer"
    >
      <div 
        onClick={handleToggleSave}
        className={`absolute top-6 right-6 transition-colors ${isSaved ? 'text-blue-500' : 'text-gray-300 hover:text-blue-500'}`}
      >
        <Bookmark className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
          <span className="text-xl font-bold text-blue-600">{job.company.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
          <p className="text-gray-500 font-medium text-sm">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5">
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <IndianRupee className="w-4 h-4 mr-1.5 text-gray-400" />
          {job.salary?.replace(/\$/g, '₹')}
        </div>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
          {job.type}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(job.tags || []).map((tag, idx) => (
          <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs font-bold text-gray-400">{formatTimeAgo(job.postedAt)}</span>
        <button className={`font-bold text-sm px-4 py-2 rounded-lg transition-colors ${applied ? 'bg-green-50 text-green-700' : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'}`}>
          {applied ? 'Applied ✓' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;

import React from 'react';
import { MapPin, DollarSign, Clock, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  const diffInDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return 'Today';
  return `${diffInDays}d`;
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer"
    >
      <div className="absolute top-6 right-6 text-gray-300 hover:text-blue-500 transition-colors">
        <Bookmark className="w-6 h-6" />
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
          <DollarSign className="w-4 h-4 mr-1.5 text-gray-400" />
          {job.salary}
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
        <button className="text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;

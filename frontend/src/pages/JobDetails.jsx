import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, DollarSign, Clock, Building, Calendar, 
  Briefcase, Users, GraduationCap, ArrowLeft, 
  Share2, Heart, ExternalLink, Star, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  const diffInDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return 'Today';
  return `${diffInDays}d`;
};

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/jobs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkApplyStatus = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/applications/check?userId=${user.id}&jobId=${id}`);
        if (response.ok) {
          const applied = await response.json();
          setHasApplied(applied);
        }
      } catch (error) {
        console.error('Failed to check apply status:', error);
      }
    };

    fetchJob();
    checkApplyStatus();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login to apply for jobs!");
      return;
    }
    
    setIsApplying(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          jobId: job.id
        }),
      });
      
      if (response.ok) {
        setHasApplied(true);
      } else {
        const errorText = await response.text();
        alert(errorText || "Failed to apply. Please try again.");
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      alert("Network error. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
        <p className="text-gray-500 mb-6">The job you are looking for does not exist or has been removed.</p>
        <Link to="/dashboard" className="text-blue-600 font-medium hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f9] pb-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Back Button */}
        <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to jobs
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN (Main Content) */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            
            {/* 1. Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl font-extrabold text-blue-600">{job.company?.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-600 font-medium">
                      <span className="hover:text-blue-600 cursor-pointer">{job.company}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="flex items-center text-yellow-500 text-sm">
                        <Star className="w-4 h-4 fill-current mr-1" /> 4.2
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none p-3 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors border border-gray-100 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="flex-1 md:flex-none p-3 text-gray-500 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-xl transition-colors border border-gray-100 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100 mb-6">
                <div>
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
                    <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Experience
                  </div>
                  <div className="font-semibold text-gray-900">{job.experience || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
                    <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Salary
                  </div>
                  <div className="font-semibold text-gray-900">{job.salary}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" /> Location
                  </div>
                  <div className="font-semibold text-gray-900">{job.location}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Job Type
                  </div>
                  <div className="font-semibold text-gray-900">{job.type}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Posted: {formatTimeAgo(job.postedAt)}</span>
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> Applicants: {job.applicantCount || 0}</span>
                </div>
                <button 
                  onClick={handleApply}
                  disabled={hasApplied || isApplying}
                  className={`w-full sm:w-auto font-bold py-3.5 px-10 rounded-xl transition-all shadow-sm ${
                    hasApplied 
                      ? 'bg-green-500 text-white cursor-not-allowed hover:bg-green-500' 
                      : 'bg-[#0b5cff] hover:bg-blue-700 text-white hover:shadow-md'
                  }`}
                >
                  {isApplying ? 'Applying...' : hasApplied ? 'Applied Successfully ✓' : 'Apply'}
                </button>
              </div>
            </div>

            {/* 2. Job Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Job Description</h2>
              <div className="prose prose-blue max-w-none text-gray-600">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {job.description || 'No detailed description provided for this job. Please contact the employer for more information.'}
                </p>
                <br/>
                <p className="font-medium text-gray-900">Key Responsibilities:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Execute and report test cases for desktop and mobile software builds.</li>
                  <li>Perform regression testing and manage bug reporting.</li>
                  <li>Communicate and escalate failures providing individual status reports.</li>
                </ul>
              </div>
            </div>

            {/* 3. Key Skills */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Key Skills</h2>
              <div className="flex flex-wrap gap-3">
                {(job.tags || []).map((tag, idx) => (
                  <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. About Company */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">About the company</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 flex items-center">
                      {job.company} <ShieldCheck className="w-5 h-5 text-green-500 ml-1.5" />
                    </h3>
                    <p className="text-gray-500 text-sm">Technology & Internet</p>
                  </div>
                </div>
                <button className="text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                  + Follow
                </button>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {job.company} is a leading global technology company specializing in e-commerce, cloud computing, digital streaming, and artificial intelligence. We foster an inclusive workplace and recruit talent from diverse backgrounds.
              </p>
              <a href="#" className="text-blue-600 font-medium text-sm flex items-center hover:underline">
                View company profile <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            
            {/* 1. Similar Jobs Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5">Similar roles you might like</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                      {job.company?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{job.title}</h4>
                      <p className="text-xs text-gray-500">{job.company}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Company Highlights */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5">Company highlights</h3>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Company Culture</h4>
                    <p className="text-xs text-gray-500">Highly rated by employees</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Work Life Balance</h4>
                    <p className="text-xs text-gray-500">Flexible working hours</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Salary & Benefits</h4>
                    <p className="text-xs text-gray-500">Competitive compensation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Safety Warning */}
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5">
              <h3 className="font-bold text-orange-900 text-sm mb-2">Beware of imposters!</h3>
              <p className="text-xs text-orange-800/80 leading-relaxed">
                JobPortal does not promise a job or an interview in exchange of money. Fraudsters may ask you to pay in the pretext of registration fee or refundable fee.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;

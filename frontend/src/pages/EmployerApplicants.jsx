import React, { useState, useEffect } from 'react';
import EmployerSidebar from '../components/EmployerSidebar';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Phone, Download, Send, CheckCircle, XCircle,
  User, Briefcase, ChevronDown, ChevronUp, Search, Filter, Clock
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const STATUS_COLORS = {
  APPLIED: 'bg-blue-50 text-blue-700',
  REVIEWING: 'bg-yellow-50 text-yellow-700',
  ACCEPTED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-600',
};

const InviteModal = ({ applicant, jobTitle, employerName, onClose, onSent }) => {
  const [message, setMessage] = useState(
    `Hi ${applicant.name},\n\nWe reviewed your application for the ${jobTitle} role and would like to invite you for an interview.\n\nPlease reply to this message or check your notifications to confirm your availability.\n\nBest regards,\n${employerName}`
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await fetch(`${API}/api/applications/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantEmail: applicant.email,
          employerName,
          jobTitle,
          message,
        }),
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => { onSent(); onClose(); }, 1500);
      }
    } catch (e) {
      console.error('Failed to send invite', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Send Interview Invite</h3>
          <p className="text-gray-500 text-sm mt-1">To: <span className="font-semibold text-gray-700">{applicant.name}</span> ({applicant.email})</p>
        </div>
        {sent ? (
          <div className="p-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-bold text-gray-800 text-lg">Invite Sent!</p>
            <p className="text-gray-500 text-sm">A notification has been delivered to {applicant.name}.</p>
          </div>
        ) : (
          <>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none text-sm text-gray-700 font-medium"
              />
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ApplicantCard = ({ application, employerName, onStatusChange }) => {
  const { applicant, job, status, appliedAt, resumeUrl } = application;
  const [expanded, setExpanded] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const profile = applicant.profile || {};
  const appliedDate = appliedAt
    ? new Date(appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Unknown';

  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${API}/api/applications/${application.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCurrentStatus(newStatus);
        onStatusChange(application.id, newStatus);
      }
    } catch (e) { console.error('Status update failed', e); }
    finally { setUpdatingStatus(false); }
  };

  return (
    <>
      {showInvite && (
        <InviteModal
          applicant={{ name: applicant.name, email: applicant.email }}
          jobTitle={job?.title || ''}
          employerName={employerName}
          onClose={() => setShowInvite(false)}
          onSent={() => setInviteSent(true)}
        />
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Card Header */}
        <div className="p-5 flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {applicant.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">{applicant.name}</h3>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <Mail className="w-3.5 h-3.5" /> {applicant.email}
                  </span>
                  {profile.phoneNumber && (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Phone className="w-3.5 h-3.5" /> {profile.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[currentStatus] || STATUS_COLORS.APPLIED}`}>
                {currentStatus}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Applied for <span className="font-semibold text-gray-600">{job?.title}</span></span>
              <span className="text-gray-300 mx-1">•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{appliedDate}</span>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        {expanded && (
          <div className="px-5 pb-4 border-t border-gray-50 pt-4 space-y-4">
            {profile.bio && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">About</p>
                <p className="text-sm text-gray-700">{profile.bio}</p>
              </div>
            )}
            {profile.experience && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                <p className="text-sm text-gray-700">{profile.experience}</p>
              </div>
            )}
            {profile.education && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Education</p>
                <p className="text-sm text-gray-700">{profile.education}</p>
              </div>
            )}
            {profile.skills?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Footer */}
        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Resume Download */}
            {(resumeUrl || profile.resumeUrl) && (
              <a
                href={`${API}${resumeUrl || profile.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Resume
              </a>
            )}

            {/* Send Invite */}
            <button
              onClick={() => setShowInvite(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                inviteSent
                  ? 'bg-green-50 text-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {inviteSent ? <CheckCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              {inviteSent ? 'Invited' : 'Send Invite'}
            </button>

            {/* Status Dropdown */}
            <select
              value={currentStatus}
              onChange={e => updateStatus(e.target.value)}
              disabled={updatingStatus}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option value="APPLIED">Applied</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded ? <><ChevronUp className="w-4 h-4" /> Less</> : <><ChevronDown className="w-4 h-4" /> More details</>}
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerApplicants = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jobFilter, setJobFilter] = useState('ALL');

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`${API}/api/applications/employer/${user.email}`)
      .then(res => res.json())
      .then(async data => {
        // Fetch profiles for each unique applicant
        const uniqueEmails = [...new Set(data.map(a => a.applicant?.email).filter(Boolean))];
        const profiles = {};
        await Promise.all(uniqueEmails.map(async email => {
          try {
            const res = await fetch(`${API}/api/profile/${email}`);
            if (res.ok) profiles[email] = await res.json();
          } catch (_) {}
        }));
        // Attach profiles
        const enriched = data.map(app => ({
          ...app,
          applicant: { ...app.applicant, profile: profiles[app.applicant?.email] || {} }
        }));
        setApplications(enriched);
      })
      .catch(err => console.error('Failed to fetch applicants', err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleStatusChange = (id, newStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // Unique jobs for filter
  const uniqueJobs = [...new Map(applications.map(a => [a.job?.id, a.job])).values()].filter(Boolean);

  const filtered = applications.filter(app => {
    const matchSearch = !search ||
      app.applicant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchJob = jobFilter === 'ALL' || String(app.job?.id) === jobFilter;
    return matchSearch && matchStatus && matchJob;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'APPLIED').length,
    reviewing: applications.filter(a => a.status === 'REVIEWING').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex flex-col lg:flex-row relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none" />
      <div className="lg:w-64 flex-shrink-0 relative z-30">
        <EmployerSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8 overflow-hidden">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Applicants</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage all applications received for your job postings.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'New', value: stats.applied, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Reviewing', value: stats.reviewing, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Accepted', value: stats.accepted, color: 'text-green-600', bg: 'bg-green-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex flex-col`}>
                <span className={`text-3xl font-extrabold ${s.color}`}>{s.value}</span>
                <span className="text-gray-500 text-sm font-semibold mt-1">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="APPLIED">Applied</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={jobFilter}
              onChange={e => setJobFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Jobs</option>
              {uniqueJobs.map(job => (
                <option key={job.id} value={String(job.id)}>{job.title}</option>
              ))}
            </select>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-500 text-sm">
                {applications.length === 0
                  ? "No one has applied to your jobs yet. Share your listings to attract candidates."
                  : "No applicants match your current filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filtered.map(app => (
                <ApplicantCard
                  key={app.id}
                  application={app}
                  employerName={user?.name || 'Employer'}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerApplicants;

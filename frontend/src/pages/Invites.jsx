import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle, Clock, Building2, Briefcase, CalendarDays, Check } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const Invites = () => {
  const { user } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`${API}/api/notifications/user/${user.email}`)
      .then(res => res.json())
      .then(data => {
        // Filter only INTERVIEW_INVITE type notifications
        const interviewInvites = data.filter(n => n.type === 'INTERVIEW_INVITE');
        setInvites(interviewInvites);
      })
      .catch(err => console.error('Failed to fetch invites', err))
      .finally(() => setLoading(false));
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API}/api/notifications/${id}/read`, { method: 'PUT' });
      setInvites(prev => prev.map(inv => inv.id === id ? { ...inv, read: true } : inv));
    } catch (e) {
      console.error('Failed to mark as read', e);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex flex-col lg:flex-row relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none" />

      <div className="lg:w-64 flex-shrink-0 relative z-30">
        <Sidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-5xl mx-auto flex-1 overflow-y-auto custom-scrollbar">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Interview Invites</h1>
                <p className="text-gray-500 font-medium">
                  {invites.length === 0
                    ? 'No invites yet'
                    : `${invites.filter(i => !i.read).length} unread invite${invites.filter(i => !i.read).length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : invites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <Mail className="w-10 h-10 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No invites yet</h3>
              <p className="text-gray-500 max-w-sm">
                When employers invite you for an interview, you'll see them here. Keep applying to jobs to increase your chances!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map(invite => (
                <div
                  key={invite.id}
                  className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${
                    invite.read
                      ? 'border-gray-100'
                      : 'border-l-4 border-l-blue-500 border-t-gray-100 border-r-gray-100 border-b-gray-100'
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Icon + Content */}
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          invite.read
                            ? 'bg-gray-100'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}>
                          {invite.read
                            ? <CheckCircle className="w-5 h-5 text-gray-400" />
                            : <Mail className="w-5 h-5 text-white" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                              invite.read
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              <Briefcase className="w-3 h-3" />
                              Interview Invite
                            </span>
                            {!invite.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed whitespace-pre-line ${
                            invite.read ? 'text-gray-500' : 'text-gray-800 font-medium'
                          }`}>
                            {invite.message}
                          </p>
                          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {formatDate(invite.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        {!invite.read ? (
                          <button
                            onClick={() => markAsRead(invite.id)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Mark Read
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invites;

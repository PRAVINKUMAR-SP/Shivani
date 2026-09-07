import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Mail, Trash2, Eye, Clock, User, Phone, MessageSquare } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API}/api/contact/all`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API}/api/contact/${id}/read`, { method: 'PUT' });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`${API}/api/contact/${id}`, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) markAsRead(msg.id);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)]">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-10 bg-gray-50 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-blue-600" />
              Contact Messages
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {messages.length} total messages • {unreadCount} unread
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Message List */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Inbox</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 ${
                      selectedMessage?.id === msg.id ? 'bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-600' : ''
                    } ${!msg.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {!msg.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>}
                          <p className={`text-sm truncate ${!msg.isRead ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                            {msg.name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{msg.subject || 'No Subject'}</p>
                        <p className="text-xs text-gray-400 mt-1 truncate">{msg.message?.substring(0, 60)}...</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] text-gray-400">{formatDate(msg.createdAt)}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            {selectedMessage ? (
              <div className="p-6 lg:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedMessage.subject || 'No Subject'}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      <User className="w-3.5 h-3.5" /> Name
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedMessage.name}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </div>
                    <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-blue-600 hover:underline">{selectedMessage.email}</a>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </div>
                    <a href={`tel:${selectedMessage.phone}`} className="text-sm font-semibold text-blue-600 hover:underline">{selectedMessage.phone}</a>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Message</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;

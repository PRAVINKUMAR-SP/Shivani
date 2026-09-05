import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2, Info, Clock } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/notifications/user/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex flex-col lg:flex-row relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="lg:w-64 flex-shrink-0 relative z-30">
        <Sidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-4xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Notifications</h2>
              <p className="text-gray-500 mt-1 font-medium">Updates on your applications and account</p>
            </div>
            {notifications.some(n => !n.read) && (
              <div className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl text-sm">
                {notifications.filter(n => !n.read).length} Unread
              </div>
            )}
          </div>

          {!user ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              Please log in to view your notifications.
            </div>
          ) : loading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">You're all caught up!</h3>
              <p className="text-gray-500">You don't have any notifications right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`bg-white rounded-2xl p-6 border transition-all ${!notification.read ? 'border-blue-100 shadow-md ring-1 ring-blue-50' : 'border-gray-100 shadow-sm opacity-75 hover:opacity-100'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'APPLICATION_SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {notification.type === 'APPLICATION_SUCCESS' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-gray-900 ${!notification.read ? 'font-bold' : 'font-medium'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {formatTime(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                    )}
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

export default Notifications;

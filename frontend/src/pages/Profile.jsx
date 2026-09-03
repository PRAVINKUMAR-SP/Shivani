import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, FileText } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    bio: '',
    phoneNumber: '',
    resumeUrl: '',
    skills: '',
    experience: '',
    education: '',
    resumeFileName: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/profile/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            bio: data.bio || '',
            phoneNumber: data.phoneNumber || '',
            resumeUrl: data.resumeUrl || '',
            skills: data.skills ? data.skills.join(', ') : '',
            experience: data.experience || '',
            education: data.education || '',
            resumeFileName: data.resumeFileName || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(s => s);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/profile/${user.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          skills: skillsArray
        })
      });
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setMessage('Please upload a PDF file.');
      return;
    }

    setParsing(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/profile/parse-resume`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProfile(prev => ({
          ...prev,
          phoneNumber: data.phoneNumber || prev.phoneNumber,
          skills: data.skills && data.skills.length > 0 ? data.skills.join(', ') : prev.skills,
          experience: data.experience || prev.experience,
          education: data.education || prev.education,
          resumeFileName: data.fileName || prev.resumeFileName
        }));
        setMessage('Resume parsed successfully! Please review the auto-filled data.');
      } else {
        setMessage(data.error || 'Failed to parse resume.');
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      setMessage('An error occurred during parsing.');
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <Sidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-4xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Your Profile</h2>
            <p className="text-gray-500 mt-1 font-medium">Manage your personal information and resume</p>
          </div>

          {!user ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              Please log in to view your profile.
            </div>
          ) : loading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-500 font-medium">{user.email}</p>
                </div>
              </div>

              {/* AI Resume Parser Banner */}
              <div className="bg-blue-50 border-y border-blue-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-blue-900 text-lg">Auto-fill your profile</h4>
                  <p className="text-blue-700 text-sm mt-1">Upload your resume (PDF) and our system will extract your skills, experience, and education automatically.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={parsing}
                    />
                    <button 
                      disabled={parsing}
                      className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm border border-blue-200 hover:border-blue-600 disabled:opacity-50"
                    >
                      {parsing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      ) : (
                        <UploadCloud className="w-5 h-5" />
                      )}
                      {parsing ? 'Parsing...' : 'Upload PDF Resume'}
                    </button>
                  </div>
                  {profile.resumeFileName && (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                      <FileText className="w-4 h-4" />
                      <span className="truncate max-w-[150px]">{profile.resumeFileName}</span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {message && (
                  <div className={`p-4 rounded-xl font-semibold ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange}
                      className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors p-3 border"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Professional Summary</label>
                  <textarea 
                    name="bio" value={profile.bio} onChange={handleChange} rows="4"
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors p-3 border resize-none"
                    placeholder="Tell employers about yourself..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Skills (comma separated)</label>
                  <input 
                    type="text" name="skills" value={profile.skills} onChange={handleChange}
                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors p-3 border"
                    placeholder="React, Node.js, Python, CSS"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Experience</label>
                    <textarea 
                      name="experience" value={profile.experience} onChange={handleChange} rows="3"
                      className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors p-3 border resize-none"
                      placeholder="e.g. 5 years at TechCorp..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Education</label>
                    <textarea 
                      name="education" value={profile.education} onChange={handleChange} rows="3"
                      className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors p-3 border resize-none"
                      placeholder="e.g. BS Computer Science, State University"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-70"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

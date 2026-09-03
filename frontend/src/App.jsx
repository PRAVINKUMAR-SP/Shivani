import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Companies from './pages/Companies';
import Services from './pages/Services';
import Financial from './pages/Financial';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <GoogleOAuthProvider clientId="409550030080-vlvdh219dk8bd3lhvvnq966ub5dhnfbd.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/services" element={<Services />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/applied" element={<AppliedJobs />} />
              <Route path="/dashboard/saved" element={<SavedJobs />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

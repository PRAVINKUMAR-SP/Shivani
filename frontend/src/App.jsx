import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Companies from './pages/Companies';
import Services from './pages/Services';
import Financial from './pages/Financial';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Invites from './pages/Invites';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import EmployerJobs from './pages/EmployerJobs';
import EmployerApplicants from './pages/EmployerApplicants';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminJobs from './pages/AdminJobs';
import AdminSettings from './pages/AdminSettings';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <GoogleOAuthProvider clientId="409550030080-vlvdh219dk8bd3lhvvnq966ub5dhnfbd.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white">
            <Toaster position="top-right" />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/services" element={<Services />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/applied" element={<AppliedJobs />} />
              <Route path="/dashboard/saved" element={<SavedJobs />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/dashboard/invites" element={<Invites />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              
              {/* Employer Routes */}
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/post-job" element={<PostJob />} />
              <Route path="/employer/jobs" element={<EmployerJobs />} />
              <Route path="/employer/applicants" element={<EmployerApplicants />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

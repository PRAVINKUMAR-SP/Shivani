import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, Loader2, Mail, Lock, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [selected, setSelected] = useState('employer'); // default selected in screenshot
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLocalAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login/local' : '/api/auth/register/local';
      
      const payload = {
        email: formData.email,
        password: formData.password,
        role: selected === 'employer' ? 'EMPLOYER' : 'SEEKER'
      };

      if (authMode === 'register') {
        payload.name = formData.name;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Authentication failed');
      }

      const backendUser = await res.json();
      setAuthUser(backendUser);
      setIsLoading(false);
      handleClose();
      
      if (backendUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (backendUser.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
        
        // Call backend to sync user and assign role
        const backendRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            role: selected === 'employer' ? 'EMPLOYER' : 'SEEKER'
          })
        });

        if (!backendRes.ok) {
          throw new Error('Backend login failed');
        }

        const backendUser = await backendRes.json();
        
        // Save to context
        setAuthUser(backendUser);
        setIsLoading(false);
        handleClose();
        
        if (backendUser.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (backendUser.role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
        setError("Google login failed");
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setError("Google login failed");
      setIsLoading(false);
    },
    onNonOAuthError: () => setIsLoading(false)
  });

  const handleGoogleLoginClick = () => {
    setIsLoading(true);
    login();
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setAuthMode('login');
    setFormData({ name: '', email: '', password: '' });
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] p-8 relative animate-in fade-in zoom-in duration-200 min-h-[400px] flex flex-col max-h-[90vh] overflow-y-auto">
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 stroke-[3]" />
          </button>
        )}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>
        
        {step === 1 ? (
          <>
            <h2 className="text-[28px] font-extrabold text-slate-800 mb-2 tracking-tight mt-4">How would you like to login?</h2>
            <p className="text-slate-500 mb-8 font-semibold text-[15px]">Select the option that best describes you.</p>

            <div className="flex flex-col gap-4">
              <div 
                onClick={() => setSelected('jobseeker')}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                  selected === 'jobseeker' 
                    ? 'border-yellow-400 shadow-[0_0_0_1px_rgba(250,204,21,1)]' 
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-1">I'm a Job Seeker</h3>
                <p className="text-slate-500 font-semibold text-[15px]">Login to find jobs near you</p>
              </div>

              <div 
                onClick={() => setSelected('employer')}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                  selected === 'employer' 
                    ? 'border-yellow-400 shadow-[0_0_0_1px_rgba(250,204,21,1)]' 
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-1">I'm an Employer</h3>
                <p className="text-slate-500 font-semibold text-[15px]">Login to manage your job listings</p>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm text-lg"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full flex-grow mt-4 w-full">
            <h2 className="text-[28px] font-extrabold text-slate-800 mb-2 tracking-tight text-center">
              {authMode === 'login' ? 'Sign in as' : 'Register as'} {selected === 'jobseeker' ? 'Job Seeker' : 'Employer'}
            </h2>
            <p className="text-slate-500 mb-8 font-semibold text-[15px] text-center">
              {authMode === 'login' ? 'Welcome back! Please enter your details.' : 'Create an account to get started.'}
            </p>
            
            {error && (
              <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLocalAuth} className="w-full flex flex-col gap-4 mb-6">
              {authMode === 'register' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm text-lg mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="w-full flex items-center gap-4 mb-6">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-400 font-medium text-sm">OR</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <button 
              onClick={handleGoogleLoginClick}
              disabled={isLoading}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all hover:shadow-md shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-gray-500 text-sm font-medium">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setError('');
                }} 
                className="text-blue-600 hover:underline font-bold"
              >
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

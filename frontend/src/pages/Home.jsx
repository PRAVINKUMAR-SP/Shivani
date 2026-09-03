import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Home as HomeIcon, 
  Building2, 
  BarChart2, 
  Award, 
  Users, 
  TrendingUp, 
  Settings, 
  Search, 
  GraduationCap, 
  Monitor, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';


const categories = [
  { name: 'Remote', icon: HomeIcon, color: 'bg-indigo-50' },
  { name: 'MNC', icon: Building2, color: 'bg-orange-50' },
  { name: 'Data Science', icon: BarChart2, color: 'bg-yellow-50' },
  { name: 'Internship', icon: Award, color: 'bg-slate-100' },
  { name: 'HR', icon: Users, color: 'bg-orange-50' },
  { name: 'Engineering', icon: Settings, color: 'bg-cyan-50' },
  { name: 'Analytics', icon: Search, color: 'bg-cyan-50' },
  { name: 'Fresher', icon: GraduationCap, color: 'bg-orange-50' },
  { name: 'Software &...', icon: Monitor, color: 'bg-indigo-50' },
  { name: 'Project Mg...', icon: CheckCircle2, color: 'bg-yellow-50' }
];

const Home = () => {
  const { user, openLoginModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <div className="bg-white min-h-[calc(100vh-96px)] flex flex-col items-center justify-start pt-12 p-4 pb-20">
      <div className="max-w-xl w-full flex flex-col items-center text-center">

        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Your next job starts here
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-800 mb-8">
          Create an account or sign in to see your personalised job recommendations.
        </p>
        
        {/* CTA Button */}
        <button onClick={openLoginModal} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto text-lg shadow-sm">
          Get Started
          <ArrowRight className="h-6 w-6 stroke-[3]" />
        </button>
      </div>

      {/* Categories */}
      <div className="mt-16 w-full max-w-5xl">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer transition-all min-w-[160px]"
            >
              <div className={`p-2 rounded-full ${cat.color} mr-3`}>
                <cat.icon className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Home;

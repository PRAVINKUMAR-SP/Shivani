import React from 'react';
import { Star, Search, Filter } from 'lucide-react';

const companiesData = [
  { name: 'Google', domain: 'google.com', rating: 4.8, reviews: '12K+', activeJobs: 154, industry: 'Internet', location: 'Mountain View, CA' },
  { name: 'Amazon', domain: 'amazon.com', rating: 4.5, reviews: '24K+', activeJobs: 320, industry: 'E-commerce', location: 'Seattle, WA' },
  { name: 'Microsoft', domain: 'microsoft.com', rating: 4.7, reviews: '18K+', activeJobs: 210, industry: 'Software', location: 'Redmond, WA' },
  { name: 'TCS', domain: 'tcs.com', rating: 4.1, reviews: '50K+', activeJobs: 1050, industry: 'IT Services', location: 'Mumbai, India' },
  { name: 'Infosys', domain: 'infosys.com', rating: 4.0, reviews: '40K+', activeJobs: 840, industry: 'IT Services', location: 'Bengaluru, India' },
  { name: 'Meta', domain: 'meta.com', rating: 4.6, reviews: '8K+', activeJobs: 95, industry: 'Social Media', location: 'Menlo Park, CA' },
  { name: 'Apple', domain: 'apple.com', rating: 4.8, reviews: '15K+', activeJobs: 120, industry: 'Consumer Electronics', location: 'Cupertino, CA' },
  { name: 'Netflix', domain: 'netflix.com', rating: 4.5, reviews: '5K+', activeJobs: 45, industry: 'Entertainment', location: 'Los Gatos, CA' },
  { name: 'Spotify', domain: 'spotify.com', rating: 4.4, reviews: '3K+', activeJobs: 30, industry: 'Music Streaming', location: 'Stockholm, Sweden' },
];

const Companies = () => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-96px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover great places to work</h1>
            <p className="mt-2 text-lg text-gray-600">Get access to millions of company reviews</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Company name or keyword"
              />
            </div>
            <button className="bg-white border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 flex-shrink-0 flex items-center gap-2 font-medium transition-colors">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:block">Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesData.map((company, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group">
              <div className="flex items-start gap-5 mb-5">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-white border border-gray-100 shadow-sm p-2 overflow-hidden">
                  <img 
                    src={`https://logo.clearbit.com/${company.domain}?size=128`} 
                    alt={`${company.name} logo`} 
                    className="w-full h-full object-contain" 
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=f3f4f6&color=4b5563&size=128` }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-700">{company.rating}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{company.reviews} reviews</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Industry</div>
                  <div className="text-sm text-gray-800">{company.industry}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Location</div>
                  <div className="text-sm text-gray-800">{company.location}</div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 rounded-lg transition-colors">
                  View {company.activeJobs} Jobs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;

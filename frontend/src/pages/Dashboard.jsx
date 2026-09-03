import React from 'react';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';

const dummyJobs = [
  { id: 1, title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '$80k - $120k', type: 'Full-time', tags: ['React', 'JavaScript', 'Tailwind'], postedAt: '2 hours ago' },
  { id: 2, title: 'Backend Engineer', company: 'DataSystems', location: 'New York, NY', salary: '$100k - $140k', type: 'Full-time', tags: ['Java', 'Spring Boot', 'SQL'], postedAt: '5 hours ago' },
  { id: 3, title: 'UI/UX Designer', company: 'Creative Studio', location: 'San Francisco, CA', salary: '$90k - $130k', type: 'Contract', tags: ['Figma', 'Prototyping', 'User Research'], postedAt: '1 day ago' },
  { id: 4, title: 'Data Scientist', company: 'AI Innovations', location: 'Remote', salary: '$120k - $160k', type: 'Full-time', tags: ['Python', 'Machine Learning', 'TensorFlow'], postedAt: '2 days ago' },
  { id: 5, title: 'DevOps Engineer', company: 'CloudNet', location: 'Austin, TX', salary: '$110k - $150k', type: 'Full-time', tags: ['AWS', 'Docker', 'Kubernetes'], postedAt: '2 days ago' },
  { id: 6, title: 'Product Manager', company: 'NextGen Apps', location: 'Remote', salary: '$100k - $140k', type: 'Full-time', tags: ['Agile', 'Jira', 'Strategy'], postedAt: '3 days ago' },
];

const Dashboard = () => {
  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col relative z-20 h-full">
        <div className="pt-8 flex-shrink-0">
          <SearchBar />
        </div>
        
        {/* Jobs Grid */}
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Recommended Jobs</h2>
              <p className="text-gray-500 mt-1 font-medium">Based on your profile and preferences</p>
            </div>
            <a href="#" className="text-blue-600 font-bold hover:underline">View all</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dummyJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

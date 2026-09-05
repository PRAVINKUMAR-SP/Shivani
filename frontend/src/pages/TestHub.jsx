import React from 'react';
import { Link } from 'react-router-dom';
import { Code, FileJson, Layout } from 'lucide-react';

const tests = [
  { id: 'html', name: 'HTML5', icon: Layout, color: 'bg-orange-100 text-orange-600', border: 'hover:border-orange-200' },
  { id: 'css', name: 'CSS3', icon: FileJson, color: 'bg-blue-100 text-blue-600', border: 'hover:border-blue-200' },
  { id: 'js', name: 'JavaScript', icon: Code, color: 'bg-yellow-100 text-yellow-600', border: 'hover:border-yellow-200' },
];

const TestHub = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Skill Assessments</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prove your expertise to employers by taking our 20-question skill assessments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Link 
              key={test.id} 
              to={`/test/${test.id}`}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md transition-all group ${test.border}`}
            >
              <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${test.color}`}>
                <test.icon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{test.name}</h2>
              <p className="text-gray-500 mb-6">20 Questions • 20 Mins</p>
              <span className="text-blue-600 font-bold group-hover:text-blue-700 transition-colors">
                Start Test &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestHub;

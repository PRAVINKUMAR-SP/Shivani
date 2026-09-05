import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { FileText, Search } from 'lucide-react';

const AdminTestResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/tests/results`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Failed to fetch test results", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter(r => 
    r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50/50 h-[calc(100vh-128px)] flex relative overflow-hidden">
      <div className="bg-blue-50/50 h-24 absolute top-0 right-0 -z-10 w-full lg:w-[calc(100%-16rem)] lg:rounded-bl-[3rem] rounded-b-[3rem] lg:rounded-br-none"></div>
      
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-10">
        <AdminSidebar />
      </div>

      <div className="flex-1 w-full flex flex-col relative z-20 h-full pt-8">
        <div className="px-4 sm:px-8 lg:px-12 pb-12 w-full max-w-7xl mx-auto flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                Skill Test Results
              </h1>
              <p className="text-gray-500 mt-2 font-medium">View scores from all users who have taken a skill assessment.</p>
            </div>
            
            <div className="relative w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading test results...</div>
            ) : filteredResults.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-medium">No test results found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="py-4 px-6 text-sm font-semibold text-gray-500">Candidate Name</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-500">Email</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-500">Subject</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-500">Score</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-500">Percentage</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-500">Date Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result) => {
                      const percentage = Math.round((result.score / result.totalQuestions) * 100);
                      return (
                        <tr key={result.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900">{result.userName || 'Unknown'}</td>
                          <td className="py-4 px-6 text-gray-500">{result.userEmail || 'N/A'}</td>
                          <td className="py-4 px-6">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {result.subject}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-gray-900">
                            {result.score} / {result.totalQuestions}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                {percentage}%
                              </span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-500 text-sm">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestResults;

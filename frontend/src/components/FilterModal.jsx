import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState('Work mode');
  
  // Static state for Work mode options (based on the image provided)
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [counts, setCounts] = useState({ office: 0, hybrid: 0, remote: 0 });

  useEffect(() => {
    if (isOpen) {
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/jobs`)
        .then(res => res.json())
        .then(data => {
          let remote = 0, hybrid = 0, office = 0;
          data.forEach(job => {
            const loc = job.location ? job.location.toLowerCase() : '';
            if (loc.includes('remote')) remote++;
            else if (loc.includes('hybrid')) hybrid++;
            else office++;
          });
          setCounts({ remote, hybrid, office: office });
        })
        .catch(err => console.error("Failed to fetch filter counts", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    'Work mode',
    'Department',
    'Salary',
    'Companies',
    'Industries',
    'Role',
    'Education',
    'Posted by',
    'Freshness',
    'Sort'
  ];

  const workModeOptions = [
    { label: 'Work from office', count: counts.office },
    { label: 'Hybrid', count: counts.hybrid },
    { label: 'Remote', count: counts.remote }
  ];

  const handleWorkModeToggle = (mode) => {
    setSelectedWorkModes(prev => 
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const handleApply = () => {
    if (onApply) {
      onApply({ workModes: selectedWorkModes });
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedWorkModes([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col relative z-10 overflow-hidden max-h-[90vh] sm:h-[600px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#111627]">Filter results</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Tabs */}
          <div className="w-1/3 bg-gray-50/50 border-r border-gray-100 overflow-y-auto">
            <ul className="flex flex-col py-2">
              {tabs.map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-6 py-4 font-semibold text-[15px] transition-colors border-l-4 ${
                      activeTab === tab 
                        ? 'bg-white border-[#2764ff] text-[#111627] shadow-[0_2px_10px_rgba(0,0,0,0.02)]' 
                        : 'border-transparent text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content */}
          <div className="w-2/3 bg-white p-6 overflow-y-auto">
            {activeTab === 'Work mode' ? (
              <div className="flex flex-col gap-4">
                {workModeOptions.map((option) => (
                  <label 
                    key={option.label}
                    className="flex items-center justify-between group cursor-pointer p-2 hover:bg-blue-50/50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        selectedWorkModes.includes(option.label)
                          ? 'bg-[#2764ff] border-[#2764ff]'
                          : 'border-gray-300 bg-white group-hover:border-[#2764ff]'
                      }`}>
                        {selectedWorkModes.includes(option.label) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[15px] font-medium ${selectedWorkModes.includes(option.label) ? 'text-[#111627]' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#2764ff]">{option.count}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <p className="font-medium text-lg text-gray-500 mb-2">More filters coming soon.</p>
                <p className="text-sm">These options are placeholders for demonstration.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
          <button 
            onClick={handleClear}
            className="text-gray-600 hover:text-gray-900 font-bold px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            Clear all
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-full font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleApply}
              className="px-8 py-2.5 rounded-full font-bold text-white bg-[#2764ff] hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
            >
              Apply filters
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterModal;

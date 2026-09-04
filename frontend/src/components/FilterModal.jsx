import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// Helper to count items matching a predicate
const countBy = (jobs, predicate) => jobs.filter(predicate).length;

const CheckboxList = ({ options, selected, onToggle }) => (
  <div className="flex flex-col gap-1">
    {options.map(({ label, count }) => (
      <label
        key={label}
        onClick={() => onToggle(label)}
        className="flex items-center justify-between group cursor-pointer px-2 py-2.5 hover:bg-blue-50/60 rounded-xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            selected.includes(label)
              ? 'bg-[#2764ff] border-[#2764ff]'
              : 'border-gray-300 bg-white group-hover:border-[#2764ff]'
          }`}>
            {selected.includes(label) && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className={`text-[14px] font-medium ${selected.includes(label) ? 'text-[#111627]' : 'text-gray-700'}`}>
            {label}
          </span>
        </div>
        <span className="text-sm font-semibold text-[#2764ff] ml-2">{count}</span>
      </label>
    ))}
  </div>
);

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState('Work mode');
  const [allJobs, setAllJobs] = useState([]);
  const [loadingCounts, setLoadingCounts] = useState(false);

  // Selected filter state
  const [selected, setSelected] = useState({
    workModes: [],
    jobTypes: [],
    companies: [],
    industries: [],
    roles: [],
    experience: [],
    salary: [],
    freshness: [],
    sort: [],
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingCounts(true);
      fetch(`${API_BASE}/api/jobs`)
        .then(res => res.json())
        .then(data => { setAllJobs(data); setLoadingCounts(false); })
        .catch(err => { console.error("Failed to fetch filter counts", err); setLoadingCounts(false); });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // === Compute counts from real data ===
  const getWorkModeCounts = () => {
    let remote = 0, hybrid = 0, office = 0;
    allJobs.forEach(job => {
      const loc = (job.location || '').toLowerCase();
      if (loc.includes('remote')) remote++;
      else if (loc.includes('hybrid')) hybrid++;
      else office++;
    });
    return [
      { label: 'Work from office', count: office },
      { label: 'Hybrid', count: hybrid },
      { label: 'Remote', count: remote },
    ];
  };

  const getJobTypeCounts = () => {
    const map = {};
    allJobs.forEach(job => {
      const t = job.type || 'Full-time';
      map[t] = (map[t] || 0) + 1;
    });
    return Object.entries(map).map(([label, count]) => ({ label, count }));
  };

  const getCompanyCounts = () => {
    const map = {};
    allJobs.forEach(job => {
      if (job.company) map[job.company] = (map[job.company] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
  };

  const getIndustryCounts = () => {
    const map = {};
    allJobs.forEach(job => {
      (job.tags || []).forEach(tag => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
  };

  const getExperienceCounts = () => {
    const map = {};
    allJobs.forEach(job => {
      const exp = job.experience || 'Not specified';
      map[exp] = (map[exp] || 0) + 1;
    });
    return Object.entries(map).map(([label, count]) => ({ label, count }));
  };

  const getSalaryCounts = () => {
    const brackets = [
      { label: '0 – 3 LPA', predicate: s => s && (s.includes('0') || s.includes('1') || s.includes('2') || s.includes('3')) },
      { label: '3 – 6 LPA', predicate: s => s && (s.includes('4') || s.includes('5') || s.includes('6')) },
      { label: '6 – 10 LPA', predicate: s => s && (s.includes('7') || s.includes('8') || s.includes('9') || s.includes('10')) },
      { label: '10+ LPA', predicate: s => s && (s.includes('10') || s.includes('12') || s.includes('15') || s.includes('20')) },
    ];
    return brackets.map(b => ({
      label: b.label,
      count: allJobs.filter(j => b.predicate(j.salary)).length,
    }));
  };

  const getFreshnessCounts = () => {
    const now = new Date();
    const getCount = (days) => allJobs.filter(j => {
      if (!j.postedAt) return false;
      const diff = (now - new Date(j.postedAt)) / (1000 * 60 * 60 * 24);
      return diff <= days;
    }).length;
    return [
      { label: 'Last 24 hours', count: getCount(1) },
      { label: 'Last 3 days', count: getCount(3) },
      { label: 'Last 7 days', count: getCount(7) },
      { label: 'Last 30 days', count: getCount(30) },
    ];
  };

  const toggle = (key, value) => {
    setSelected(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleApply = () => {
    if (onApply) onApply(selected);
    onClose();
  };

  const handleClear = () => {
    setSelected({ workModes: [], jobTypes: [], companies: [], industries: [], roles: [], experience: [], salary: [], freshness: [], sort: [] });
  };

  const totalSelected = Object.values(selected).reduce((acc, arr) => acc + arr.length, 0);

  const tabs = [
    { id: 'Work mode', key: 'workModes', options: getWorkModeCounts() },
    { id: 'Job Type', key: 'jobTypes', options: getJobTypeCounts() },
    { id: 'Salary', key: 'salary', options: getSalaryCounts() },
    { id: 'Companies', key: 'companies', options: getCompanyCounts() },
    { id: 'Industries', key: 'industries', options: getIndustryCounts() },
    { id: 'Experience', key: 'experience', options: getExperienceCounts() },
    { id: 'Freshness', key: 'freshness', options: getFreshnessCounts() },
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col relative z-10 overflow-hidden max-h-[90vh] sm:h-[600px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#111627]">Filter results</h2>
            {totalSelected > 0 && (
              <span className="bg-[#2764ff] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {totalSelected}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Tabs */}
          <div className="w-1/3 bg-gray-50/50 border-r border-gray-100 overflow-y-auto flex-shrink-0">
            <ul className="flex flex-col py-2">
              {tabs.map(({ id, key }) => {
                const selCount = selected[key]?.length || 0;
                return (
                  <li key={id}>
                    <button
                      onClick={() => setActiveTab(id)}
                      className={`w-full text-left px-5 py-3.5 font-semibold text-[14px] transition-colors border-l-4 flex items-center justify-between ${
                        activeTab === id
                          ? 'bg-white border-[#2764ff] text-[#111627]'
                          : 'border-transparent text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                      }`}
                    >
                      <span>{id}</span>
                      {selCount > 0 && (
                        <span className="bg-[#2764ff] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                          {selCount}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Content */}
          <div className="flex-1 bg-white p-5 overflow-y-auto">
            {loadingCounts ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-[#2764ff] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : currentTab.options.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                <p className="font-medium text-gray-500">No options available</p>
                <p className="text-sm mt-1">No data found for this filter category</p>
              </div>
            ) : (
              <CheckboxList
                options={currentTab.options}
                selected={selected[currentTab.key] || []}
                onToggle={(val) => toggle(currentTab.key, val)}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
          <button
            onClick={handleClear}
            className="text-gray-600 hover:text-gray-900 font-bold px-4 py-2 hover:bg-gray-50 rounded-full transition-colors text-sm"
          >
            Clear all {totalSelected > 0 && `(${totalSelected})`}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-8 py-2.5 rounded-full font-bold text-white bg-[#2764ff] hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-sm"
            >
              Apply filters {totalSelected > 0 && `(${totalSelected})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

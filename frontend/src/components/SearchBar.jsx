import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import FilterModal from './FilterModal';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (onSearch) onSearch(val, location);
  };

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocation(val);
    if (onSearch) onSearch(keyword, val);
  };

  const handleSearch = (customFilters = null) => {
    if (onSearch) {
      onSearch(keyword, location, customFilters || {});
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-6 mb-10 z-10 relative px-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
        {/* Search pill */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-none border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row items-center p-2 transition-colors duration-200">
        
        {/* Keyword Search */}
        <div className="flex items-center flex-1 w-full px-4 py-2 group">
          <Search className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3 stroke-[2.5]" />
          <input 
            type="text" 
            placeholder="Job title, keywords, or company" 
            className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium text-[16px]"
            value={keyword}
            onChange={handleKeywordChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] h-10 bg-gray-200 dark:bg-slate-700 mx-2 transition-colors duration-200"></div>

        {/* Location Search */}
        <div className="flex items-center flex-1 w-full px-4 py-2 mt-2 md:mt-0 group">
          <MapPin className="text-gray-600 dark:text-gray-400 w-6 h-6 mr-3 stroke-[2.5]" />
          <input 
            type="text" 
            placeholder='City, state, zip code, or "remote"' 
            className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium text-[16px]"
            value={location}
            onChange={handleLocationChange}
            onKeyDown={handleKeyDown}
          />
        </div>

          {/* Find Jobs Button */}
          <div className="w-full md:w-auto mt-4 md:mt-0 px-2 md:px-0">
            <button 
              onClick={() => handleSearch()}
              className="w-full md:w-auto bg-[#0b5cff] hover:bg-blue-700 text-white font-bold text-[17px] py-3.5 px-8 rounded-full transition-colors whitespace-nowrap"
            >
              Find jobs
            </button>
          </div>
        </div>

        {/* Filter Button — outside the pill, right of Find jobs */}
        <button 
          onClick={() => setIsFilterModalOpen(true)}
          className="flex-shrink-0 flex items-center justify-center w-full md:w-auto gap-2 px-4 py-3.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-none text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all font-semibold text-[15px] whitespace-nowrap"
          title="Advanced Filters"
        >
          <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
          <span>Filters</span>
        </button>
      </div>

      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          handleSearch(filters);
        }}
      />
    </div>
  );
};

export default SearchBar;

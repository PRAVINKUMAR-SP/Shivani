import React from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto -mt-6 mb-10 z-10 relative px-4">
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200 flex flex-col md:flex-row items-center p-2">
        
        {/* Keyword Search */}
        <div className="flex items-center flex-1 w-full px-4 py-2 group">
          <Search className="text-gray-600 w-6 h-6 mr-3 stroke-[2.5]" />
          <input 
            type="text" 
            placeholder="Job title, keywords, or company" 
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-500 font-medium text-[16px]"
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] h-10 bg-gray-200 mx-2"></div>

        {/* Location Search */}
        <div className="flex items-center flex-1 w-full px-4 py-2 mt-2 md:mt-0 group">
          <MapPin className="text-gray-600 w-6 h-6 mr-3 stroke-[2.5]" />
          <input 
            type="text" 
            placeholder='City, state, zip code, or "remote"' 
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-500 font-medium text-[16px]"
          />
        </div>

        {/* Find Jobs Button */}
        <div className="w-full md:w-auto mt-4 md:mt-0 px-2 md:px-0">
          <button className="w-full md:w-auto bg-[#0b5cff] hover:bg-blue-700 text-white font-bold text-[17px] py-3.5 px-8 rounded-full transition-colors whitespace-nowrap">
            Find jobs
          </button>
        </div>

      </div>
    </div>
  );
};

export default SearchBar;

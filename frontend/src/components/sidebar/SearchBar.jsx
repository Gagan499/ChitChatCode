import React from 'react';
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react';

const SearchBar = () => {
  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex items-center flex-1 bg-[#EAF2FE] rounded-full px-3 py-2">
        <MagnifyingGlass color="#709CE6" size={20} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm"
        />
      </div>
      <button className="text-gray-500">
        <Funnel size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
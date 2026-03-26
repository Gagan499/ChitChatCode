import React from "react";
import { MagnifyingGlass, Funnel, X } from "@phosphor-icons/react";
import { useChat } from "../../hooks/useChat";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useChat();

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex items-center flex-1 bg-[#EAF2FE] rounded-full px-3 py-2">
        <MagnifyingGlass color="#709CE6" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button className="text-gray-500">
        <Funnel size={20} />
      </button>
    </div>
  );
};

export default SearchBar;

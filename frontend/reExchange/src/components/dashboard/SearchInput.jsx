import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

const SearchInput = ({ placeHolder, onSearch }) => {
   const [searchTerm, setSearchTerm] = useState("");

   const handleSearch = (event) => {
      event.preventDefault();
      onSearch(searchTerm);
   };

   return (
      <form
         onSubmit={handleSearch}
         className="flex-1 flex items-center relative"
      >
         <input
            type="search "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeHolder}
            className="w-full px-4 ps-12 py-2 rounded-lg bg-inherit border border-[#4C4C4C] text-[#4C4C4C] dark:text-white placeholder-[#7C7C7C] focus:outline-none"
         />
         <div className="absolute left-4">
            <CiSearch />
         </div>
      </form>
   );
};

export default SearchInput;

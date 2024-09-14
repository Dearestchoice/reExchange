import React from "react";
import SearchInput from "./SearchInput";
import Button from "../Button";
import profile from "../../assets/images/profile-icon.png";

const DashboardHeader = () => {
   const handleSearch = (searchTerm) => {
      console.log("searching for:", searchTerm);
   };

   return (
      <header className="">
         <div className="flex gap-4 items-center justify-between">
            <h2 className="font-orbitron text-[22px] font-semibold">
               Dashboard
            </h2>
            <SearchInput
               placeHolder="Search transactions by ID, amount, or date"
               onSearch={handleSearch}
            />
            <Button className="bg-[#8E2DE2] hover:bg-[#7B29E7] border-transparent">
               Send
            </Button>
            <Button className="">Convert</Button>

            <div>
               <img src={profile} alt="" className="cursor-pointer h-6 w-6" />
            </div>
         </div>
      </header>
   );
};

export default DashboardHeader;

import React, { useContext } from "react";
import SearchInput from "./SearchInput";
import Button from "../Button";
import profile from "../../assets/images/profile-icon.png";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { ThemeContext } from "../../contexts/ThemeContext";

const DashboardHeader = ({ title }) => {
   const { toggleTheme, theme } = useContext(ThemeContext);

   const handleSearch = (searchTerm) => {
      console.log("searching for:", searchTerm);
   };

   return (
      <header className="p-4 py-10 bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-white  relative">
         <div className="flex gap-4 items-center justify-between">
            <h2 className="font-orbitron text-[22px] font-semibold">{title}</h2>
            <SearchInput
               placeHolder="Search transactions by ID, amount, or date"
               onSearch={handleSearch}
            />
            <Button className="bg-[#8E2DE2] hover:bg-[#7B29E7] border-transparent">
               Send
            </Button>
            <Button>Convert</Button>

            <Button className="border-none p-0 m-0" onClick={toggleTheme}>
               {theme === "light" ? (
                  <MdDarkMode title="switch to darkmode " />
               ) : (
                  <MdLightMode title="switch to lightmode " />
               )}
            </Button>

            <div>
               <img src={profile} alt="" className="cursor-pointer h-6 w-6" />
            </div>
         </div>
      </header>
   );
};

export default DashboardHeader;

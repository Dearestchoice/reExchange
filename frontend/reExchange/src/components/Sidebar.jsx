import React from "react";
import logo from "../assets/images/reExchange-logo.png";
import { NavLink } from "react-router-dom";
import { SidebarButton } from "./SidebarButton";
import { MdDashboard } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { GrAnalytics } from "react-icons/gr";
import { FaWallet } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";

const Sidebar = () => {
   return (
      <div className="p-11 border-r border-[#4C4C4C]">
         <div className="flex mb-10 items-center gap-16 justify-between">
            <img
               className=" "
               src={logo}
               title="reExchange Logo"
               alt="reExchange Logo"
            />
         </div>

         <div className="main-links flex flex-col justify-center items-center">
            <NavLink to="">
               <SidebarButton word={"Dashboard"} icon={<MdDashboard size={18} />} />
            </NavLink>
            <NavLink to="conversion">
               <SidebarButton word={"Conversion"} icon={<FaExchangeAlt size={18} />} />
            </NavLink>
            <NavLink to="analytics">
               <SidebarButton word={"Analytics"} icon={<GrAnalytics size={18} />} />
            </NavLink>
            <NavLink to="payments">
               <SidebarButton word={"Payments"} icon={<FaWallet size={18} />} />
            </NavLink>
            <NavLink to="settings">
               <SidebarButton word={"Settings"} icon={<MdOutlineSettings size={18} />} />
            </NavLink>
           
         </div>
      </div>
   );
};

export default Sidebar;

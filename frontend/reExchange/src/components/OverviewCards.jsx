import React from "react";
// import { hourGlass } from "../assets/images/hourGlass.png";

const OverviewCards = ({ title, amount, imgSrc }) => {
   return (
      <div className="rounded-md border border-[#FFFFFF17] cursor-pointer p-4 py-6 shadow-sm flex flex-col transition-all duration-500 ease-in  hover:text-white group">
         <div className="flex justify-between">
            <small className="text-[14px] mb-4 leading-[17.83px]">
               {title}
            </small>
            <div className="icon">
               <img src={imgSrc} alt="" />
            </div>
         </div>
         <div className="font-semibold text-[18px] leading-6">{amount}</div>
      </div>
   );
};

export default OverviewCards;

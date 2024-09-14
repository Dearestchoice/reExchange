import React from "react";

export const SidebarButton = ({ word, icon }) => {
   return (
      <div className="flex items-center px-6 py-3 position-relative">
         <div className="rounded-md" title={word}>
            {icon}
         </div>
         <span className="ml-4 ">{word}</span>
      </div>
   );
};

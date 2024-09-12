import React from "react";

export const SidebarButton = ({ word, icon }) => {
   return (
      <div className="flex items-center pb-4 position-relative">
         <div className="rounded-md" title={word}>
            {icon}
         </div>
         <span className="ml-2 mb-1">{word}</span>
      </div>
   );
};

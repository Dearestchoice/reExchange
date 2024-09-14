import React from "react";

const Button = ({ onClick, type = "button", children, className = "" }) => {
   const buttonClass = `border-[.2px] rounded-lg px-5 font-grotesk py-1 text-base ${className}`;
   return (
      <button onClick={onClick} type={type} className={buttonClass}>
         {children}
      </button>
   );
};

export default Button;

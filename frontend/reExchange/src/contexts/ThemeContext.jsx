import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const getInitialTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
         return storedTheme;
      }
      const userPrefersDark = window.matchMedia(
         "(prefers-color-scheme: dark)"
      ).matches;
      return userPrefersDark ? "dark" : "light"; //default to dark
   };
   const [theme, setTheme] = useState(getInitialTheme);

   useEffect(() => {
      const applyTheme = (theme) => {
         if (theme === "dark") {
            document.documentElement.classList.add("dark");
         } else {
            document.documentElement.classList.remove("dark");
         }
         localStorage.setItem("theme", theme);
      };

      applyTheme(theme);

      //   listen to changes is users OS prefrences
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
         if (!localStorage.getItem("theme"))
            setTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
   }, [theme]);

   const toggleTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
   };

   return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};

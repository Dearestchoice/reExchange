export const getCryptoStatusStyle = (status) => {
   switch (status) {
      case "Completed":
         return "text-green-800 dark:text-[#28A745] border rounded-full border-[#28A745]";
      case "Pending":
         return "text-yellow-800 rounded-full border border-[#FF9800] dark:text-[#FF9800]";
      case "Failed":
         return "text-red-800 rounded-full border border-[#DC3545] dark:text-[#DC3545]";
      default:
         return "";
   }
};

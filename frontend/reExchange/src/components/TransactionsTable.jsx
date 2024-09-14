import React from "react";
import { transactionsDemo } from "../data/transactionsDemo";
import { getCryptoStatusStyle } from "../utils/getCryptoStatusStyle";
import { FaBitcoin, FaCoins, FaEthereum } from "react-icons/fa";

const TransactionsTable = () => {
   const getCryptoIcon = (crypto) => {
      switch (crypto) {
         case "Bitcoin":
            return <FaBitcoin className="text-yellow-400" />;
         case "Ethereum":
            return <FaEthereum className="text-blue-400" />;
         case "Litecoin":
            return <FaCoins className="text-yellow-300" />;
         default:
            return null;
      }
   };
   return (
      <div className="mt-8 border-[#FFFFFF17] bg-white dark:bg-[#FFFFFF0A] p-5 py-8 overflow-x-auto rounded-lg shadow-lg">
         <h2 className="text-lg px-4 font-bold text-black dark:text-[#F3F3F3] font-orbitron mb-4">
            Recent Transactions
         </h2>
         <table className="min-w-full table-auto ">
            <thead>
               <tr>
                  <th className="px-4 py-6 text-left text-gray-800 dark:text-[#B9B9B9]">
                     Date
                  </th>
                  <th className="px-4 py-6 text-left text-gray-800 dark:text-[#B9B9B9]">
                     Type
                  </th>
                  <th className="px-4 py-6 text-left text-gray-800 dark:text-[#B9B9B9]">
                     Amount
                  </th>
                  <th className="px-4 py-6 text-left text-gray-800 dark:text-[#B9B9B9]">
                     Crypto
                  </th>
                  <th className="px-4 py-6 text-left text-gray-800 dark:text-[#B9B9B9]">
                     Status
                  </th>
                  <th className="px-4 py-6 text-left text-gray-800 dark:text-[#B9B9B9]">
                     Wallet Address
                  </th>
               </tr>
            </thead>
            <tbody>
               {transactionsDemo.map((transaction, index) => (
                  <tr
                     key={index}
                     className="text-[14px] border-gray-300 dark:border-gray-700"
                  >
                     <td className="px-4 py-2 text-gray-700 dark:text-[#969696]">
                        {transaction.date}
                     </td>
                     <td className="px-4 py-2 text-gray-700 dark:text-[#969696]">
                        {transaction.type}
                     </td>
                     <td className="px-4 py-2 text-gray-700 dark:text-[#969696]">
                        {transaction.amount}
                     </td>
                     <td className="px-4 py-2 text-base flex items-center gap-2 text-gray-700 dark:text-[#D8D8D8]">
                        {getCryptoIcon(transaction.crypto)}
                        {transaction.crypto}
                     </td>
                     <td className="px-4 py-2 text-[11px]">
                        <span
                           className={`px-3 py-1 rounded-full font-medium ${getCryptoStatusStyle(
                              transaction.status
                           )}`}
                        >
                           {transaction.status}
                        </span>
                     </td>
                     <td className="px-4 py-2 text-gray-700 dark:text-[#969696]">
                        {transaction.walletAddress}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default TransactionsTable;

import React from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewCards from "../components/OverviewCards";
import TransactionsTable from "../components/TransactionsTable";

const AnalyticsPage = () => {
   return (
      <div className="text-black dark:text-white flex flex-col">
         <DashboardHeader title={"Activity"} />
         <main className="flex-1 p-4">
            <div className="grid sm:w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               <OverviewCards
                  title={"Total Transactions"}
                  amount={"2"}
                  hasIcon={false}
               />
               <OverviewCards
                  title={"Pending Conversions"}
                  amount={"67"}
                  hasIcon={false}
               />
               <OverviewCards
                  title={"Pending Transactions"}
                  amount={"6"}
                  imhasIcon={false}
               />
               <OverviewCards
                  title={"Failed Transactions"}
                  amount={"5"}
                  hasIcon={false}
               />
            </div>
            <div className="">
               <TransactionsTable />
            </div>
         </main>
      </div>
   );
};

export default AnalyticsPage;

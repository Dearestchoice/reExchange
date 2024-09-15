import React from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewCards from "../components/OverviewCards";
import  hourGlass  from "../assets/images/hourGlass.png";
import  wallet  from "../assets/images/wallet.png";
import  coinExchange  from "../assets/images/coinExchange.png";
import  totalCoins  from "../assets/images/totalCoins.png";

const DashboardPage = () => {
   return (
      <div className="text-black dark:text-white flex flex-col">
         <DashboardHeader title={"Dashboard"} />
         <main className="flex-1 p-4">
            <div className="grid sm:w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               <OverviewCards
                  title={"Total Processed Amount"}
                  amount={"$12345.67"}
                  imgSrc={totalCoins}
               />
               <OverviewCards
                  title={"Pending Payments"}
                  amount={"$12345.67"}
                  imgSrc={hourGlass}
               />
               <OverviewCards
                  title={"Fiat Conversion"}
                  amount={"$2345.7"}
                  imgSrc={coinExchange}
               />
               <OverviewCards
                  title={"Received Payments"}
                  amount={"5 Payemnts Received"}
                  imgSrc={wallet}
               />
            </div>

            <div>
               This is from my branch
            </div>
         </main>
      </div>
   );
};

export default DashboardPage;

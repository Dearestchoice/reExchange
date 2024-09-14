import { Route, Routes } from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import Sidebar from "./components/sidebar";
import ConversionPage from "./pages/ConversionPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
   return (
      <div className="bg-white dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-white min-h-screen flex flex-row">
         <Sidebar />
         <div className="flex-1 mx-4">
            <Routes>
               <Route path="" Component={DashboardPage} />
               <Route path="conversion" Component={ConversionPage} />
               <Route path="analytics" Component={AnalyticsPage} />
               <Route path="payments" Component={PaymentsPage} />
               <Route path="settings" Component={SettingsPage} />
            </Routes>
         </div>
      </div>
   );
}

export default App;

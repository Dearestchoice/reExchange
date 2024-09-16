import React from 'react'
import { dashboardChartDemo} from "../data/dashboardChartDemo";
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

const DashboardChart = () => {
    const colorPalettes = ['#00BCD4','#F6C744', '#FF6F61' ];
  return (
    <>
        {dashboardChartDemo.map((data, index) => (
                      <div key={index} className="border border-[#FFFFFF17] rounded-xl px-6 py-4">
                      <div className="mb-8"> 
                         <h2 className="text-lg font-bold">{data.title}</h2>
                         <p className="text-base font-normal">Date Range: Last {data.dateRange} Days</p>
                         <p className="text-sm font-normal">Amount in {data.currency}</p>    
                      </div>
                      <div className="w-56  h-56"> 
                      <ResponsiveContainer width={"100%"} height={"100%"}>
                        <BarChart width={48} height={48} data={data.demoData}>
                           <defs>
                           <linearGradient id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={colorPalettes[index]}  stopOpacity={1}/>
                              <stop offset="70%" stopColor={colorPalettes[index]} stopOpacity={0.7}/>
                           </linearGradient>
                           </defs>
                        <Bar  dataKey="transactions"  fill={`url(#color-${index})`}  radius={[20, 20, 20, 20]} barSize={25}></Bar>
                        <XAxis dataKey="date" tickLine={false} axisLine={false}></XAxis>
                        </BarChart>  
                     </ResponsiveContainer>
                      </div>
                    </div>
            
                  ))}
    </>
  )
}

export default DashboardChart
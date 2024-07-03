// import React, { useState, useEffect } from 'react';
// import { Line, Radar } from 'react-chartjs-2';
// import Chart from 'chart.js/auto';
// import { CategoryScale, RadialLinearScale } from 'chart.js';
// import { Data, MonthlyData } from './data';
// import './trends.css';
//
// Chart.register(CategoryScale, RadialLinearScale);
//
// function transformLineData(data) {
//     return {
//         labels: data.map(d => d.Category),
//         datasets: [
//             {
//                 label: 'Expenditure',
//                 data: data.map(d => d.Expenditure),
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 borderWidth: 1,
//             },
//             {
//                 label: 'Budget',
//                 data: data.map(d => d.Budget),
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };
// }
//
// function calculateDifference(data) {
//     return data.map(d => ({
//         Category: d.Category,
//         Difference: d.Expenditure - d.Budget,
//     }));
// }
//
// function transformRadarData(monthData) {
//     const categories = Object.keys(monthData).filter(key => key !== 'Month');
//
//     return {
//         labels: categories,
//         datasets: [
//             {
//                 label: monthData.Month,
//                 data: categories.map(category => monthData[category]),
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };
// }
//
// function LineChart({ chartData }) {
//     return (
//         <Line
//             data={chartData}
//             options={{
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Expenditure vs Budget by Category',
//                     },
//                     legend: {
//                         display: true,
//                     },
//                 },
//                 scales: {
//                     x: {
//                         title: {
//                             display: true,
//                             text: 'Category',
//                         },
//                     },
//                     y: {
//                         title: {
//                             display: true,
//                             text: 'Amount',
//                         },
//                         min: 0,
//                     },
//                 },
//             }}
//         />
//     );
// }
//
// function RadarChart({ chartData }) {
//     return (
//         <Radar
//             data={chartData}
//             options={{
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Monthly Expenditure by Category',
//                     },
//                     legend: {
//                         display: true,
//                     },
//                 },
//                 scales: {
//                     r: {
//                         angleLines: {
//                             display: true,
//                         },
// 			ticks: {
//                             display: false, // Hide the numbers on the radial axis
//                         },
//                     },
//                 },
//             }}
//         />
//     );
// }
//
// function Trends() {
//     const [lineChartData, setLineChartData] = useState(null);
//     const [radarChartData, setRadarChartData] = useState(null);
//     const [differences, setDifferences] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState(MonthlyData[0].Month);
//
//     useEffect(() => {
//         setLineChartData(transformLineData(Data));
//         setRadarChartData(transformRadarData(MonthlyData.find(d => d.Month === selectedMonth)));
//         setDifferences(calculateDifference(Data));
//     }, [selectedMonth]);
//
//     if (!lineChartData || !radarChartData) return <div>Loading...</div>;
//
//     return (
//         <div className="Trends">
//             <div className="content">
//                 <div className="section">
//                     <h2>Expenditure vs Allotted Budget</h2>
//                     <LineChart chartData={lineChartData} />
//                     <div className="rundown">
//                         <h3>Rundown</h3>
//                         <ul>
//                             {differences.map(diff => (
//                                 <li key={diff.Category}>
//                                     {diff.Category}: {diff.Difference > 0 ? `Over by $${diff.Difference}` : `Under by $${Math.abs(diff.Difference)}`}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//                 <div className="section">
//                     <h2>Monthly Expenditure</h2>
//                     <div className="month-selector">
//                         <label>Select Month: </label>
//                         <select
//                             value={selectedMonth}
//                             onChange={e => setSelectedMonth(e.target.value)}
//                         >
//                             {MonthlyData.map(monthData => (
//                                 <option key={monthData.Month} value={monthData.Month}>
//                                     {monthData.Month}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <RadarChart chartData={radarChartData} />
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default Trends;

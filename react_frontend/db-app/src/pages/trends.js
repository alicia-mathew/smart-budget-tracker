import React, { useState, useEffect } from 'react';
import { Line, Radar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryScale, RadialLinearScale } from 'chart.js';
import './trends.css';
import axios from 'axios';

Chart.register(CategoryScale, RadialLinearScale);

function transformLineData(data) {
    return {
        labels: data.map(d => d.category),
        datasets: [
            {
                label: 'Expenditure',
                data: data.map(d => d.totalAmount),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Budget',
                data: data.map(d => d.amount),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };
}

function calculateDifference(data) {
    return data.map(d => ({
        category: d.category,
        difference: (d.totalAmount - d.amount).toFixed(2),
    }));
}

function transformRadarData(monthData) {
    const categories = Object.keys(monthData).filter(key => key !== 'Month');

    return {
        labels: categories,
        datasets: [
            {
                label: monthData.Month,
                data: categories.map(category => monthData[category]),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };
}

function LineChart({ chartData }) {
    return (
        <Line
            data={chartData}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: 'Expenditure vs Budget by Category',
                    },
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Category',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount',
                        },
                        min: 0,
                    },
                },
            }}
        />
    );
}

function RadarChart({ chartData }) {
    return (
        <Radar
            data={chartData}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Expenditure by Category',
                    },
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true,
                        },
                        ticks: {
                            display: false, // Hide the numbers on the radial axis
                        },
                    },
                },
            }}
        />
    );
}

function Trends() {
    const [lineChartData, setLineChartData] = useState(null);
    const [radarChartData, setRadarChartData] = useState(null);
    const [differences, setDifferences] = useState([]);
    const [months, setMonths] = useState([]);
    const [lineSelectedMonth, setLineSelectedMonth] = useState('');
    const [radarSelectedMonth, setRadarSelectedMonth] = useState('');
    const navigate = useNavigate();

    const user_id = useParams();

    const createLineChart = async () => {
        try {
            const expensesResponse = await axios.get(`http://127.0.0.1:5000/api/radartrends?user_id=${user_id}`);
            const budgetsResponse = await axios.get(`http://127.0.0.1:5000/api/budget?user_id=${user_id}`);
            console.log(budgetsResponse.data);
            const monthlyData = expensesResponse.data;
            const monthList = monthlyData.map(d => d.Month);
            setMonths(monthList);

            let selectedMonthData = monthlyData.find(d => d.Month === lineSelectedMonth);
            if (!selectedMonthData) {
                setLineSelectedMonth(monthList[0]);
                selectedMonthData = monthlyData[0];
            }

            const categoryExpenditure = Object.keys(selectedMonthData)
                .filter(key => key !== 'Month')
                .map(category => ({
                    category,
                    totalAmount: selectedMonthData[category],
                    amount: budgetsResponse.data.find(b => b.category === category)?.amount || 0,
                }));
	    console.log(categoryExpenditure);
            setLineChartData(transformLineData(categoryExpenditure));
            setDifferences(calculateDifference(categoryExpenditure));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const createRadarChart = async () => {
	try {
	    const response = await axios.get(`http://127.0.0.1:5000/api/radartrends?user_id=${user_id}`);
	    console.log(response.data);
	    const monthList = response.data.map(d => d.Month);
	    setMonths(monthList)
	    if (radarSelectedMonth) {
		setRadarChartData(transformRadarData(response.data.find(d => d.Month == radarSelectedMonth)))
	    } else {
		setRadarSelectedMonth(monthList[0])
		setRadarChartData(transformRadarData(response.data.find(d => d.Month == monthList[0])));
	    }
	    console.log(radarChartData);
	} catch (error) {
	    console.error('Error fertching data: ', error);
	}
    };

    const goDashboard = () => {
	navigate('/dashboard');
	navigate(0);
    };

    useEffect(() => {
        createLineChart();
	createRadarChart();
    }, []);

    useEffect(() => {
	if (lineSelectedMonth) {
	    createLineChart();
	}
    }, [lineSelectedMonth]);

    useEffect(() => {
	if (radarSelectedMonth) {
	    createRadarChart();
	}
    }, [radarSelectedMonth]);

    // if (!lineChartData && !radarChartData) return <div>No expenses logged...</div>;

    return (
        <div className="Trends">
            <div className="content">
                <div className="section">
                    <h2>Expenditure vs Allotted Budget</h2>
                    <div className="month-selector">
                        <label>Select Month: </label>
                        <select
                            value={lineSelectedMonth}
                            onChange={e => setLineSelectedMonth(e.target.value)}
                        >
                            {months.map(month => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
		    {lineChartData && <LineChart chartData={lineChartData} />}
                    <div className="rundown">
                        <h3>Rundown</h3>
                        <ul>
                            {differences.map(diff => (
                                <li key={diff.category}>
                                    {diff.category}: {diff.difference > 0 ? `Over by $${diff.difference}` : `Under by $${Math.abs(diff.difference)}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="section">
                    <h2>Monthly Expenditure</h2>
                    <div className="month-selector">
                        <label>Select Month: </label>
                        <select
                            value={radarSelectedMonth}
                            onChange={e => setRadarSelectedMonth(e.target.value)}
                        >
                            {months.map(month => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    {radarChartData && <RadarChart chartData={radarChartData} />}
                </div>
            </div>
	    <br/>
	    <div className="button">
		<button className="dashboard-button" onClick={() => {goDashboard();}}>Return to Dashboard</button>
	    </div>
        </div>
	
    );
}

export default Trends;

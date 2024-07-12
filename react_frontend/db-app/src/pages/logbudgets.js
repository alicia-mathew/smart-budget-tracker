import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useNavigation } from 'react-router-dom';
import './logbudgets.css'
import { useParams } from 'react-router-dom';

function LogBudgets() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([{category : '', value : '', startDate : '', endDate : '', isNew : true}]);
    const [budget, setBudget] = useState([]);

    const { user_id } = useParams();

    useEffect(() => {fetchBudget();}, []);

    const fetchBudget = async () => {
	const response = await axios.get(`http://127.0.0.1:5000/api/budget?user_id=${user_id}`);
	console.log(response.data);
	setBudget(response.data);
	const formattedRows = response.data.map(budget => ({
	    category: budget.category,
	    value: budget.amount.toString(), // Convert amount to string if necessary
	    startDate: new Date(budget.start_date).toISOString().split('T')[0],
	    endDate: new Date(budget.end_date).toISOString().split('T')[0],
	    isNew: false
	}));
	setRows([...formattedRows, {category : '', value : '', startDate : '', endDate : '', isNew : true}]);
    };

    const addRow = () => {
	setRows([...rows, {category : '', value : '', startDate : '', endDate : '', isNew : true}]);
    };

    const handleCategoryChange = (index, value) => {
	const newRow = [...rows];
	newRow[index].category = value;
	setRows(newRow);
    };

    const handleBudgetChange = (index, value) => {
	const newRow = [...rows];
	newRow[index].value = value;
	setRows(newRow);
    };

    const handleDateChange = (index, value) => {
	const newRow = [...rows];
	newRow[index].startDate = value;
	const start = new Date(value);
	console.log(start);
	start.setMonth(start.getMonth() + 1);
	newRow[index].endDate = start.toISOString().split('T')[0];
	newRow[index].isNew = true;
	setRows(newRow);
    };
    
    const addBudget = async () => {
	const lastRow = rows[rows.length - 1];
	lastRow['user_id'] = user_id;
	if (lastRow.isNew) {
	    try {
		await axios.post(`http://127.0.0.1:5000/api/category`, lastRow);
		setBudget([...budget, lastRow]);
		addRow();
	    } catch (error) {
		console.error("Error while posting to budget: ", error);
	    }
	}
    };

    const goDashboard = () => {
	navigate('/dashboard');
	navigate(0);
    };


    return (
	<div className="logbudgets">
	    <h2>Log Budget Categories</h2>
	    <div className="budget-table">
		<div className="table-row">
		    <div className="table-header">Categories</div>
		    <div className="table-header">Budget</div>
		    <div className="table-header">Start Date</div>
		    <div className="table-header">End Date</div>
		</div>
		{rows.map((row, index) => (
		  <div className="table-row" key={index}>
		    <input
		      type="text"
		      value={row.category}
		      onChange={(e) => handleCategoryChange(index, e.target.value)}
		    />
		    <input
		      type="text"
		      value={row.value}
		      onChange={(e) => handleBudgetChange(index, e.target.value)}
		    />
		    {row.isNew ? (
			<input
			    type="date"
			    value={row.startDate}
			    onChange={(e) => handleDateChange(index, e.target.value)}
			/>
		    ) : (
			<div>{row.startDate}</div>
                    )}
		    <div>
			{row.endDate}
		    </div>
		  </div>
		))}
		<div className="table-row">
		  <button onClick={() => {addBudget();}}>+</button>
		</div>
	    </div>
	    <button onClick={() => {goDashboard();}}>Dashboard</button>
	</div>
    );
}

export default LogBudgets;

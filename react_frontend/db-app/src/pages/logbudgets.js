import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './logbudgets.css'
import { useParams } from 'react-router-dom';

function LogBudgets() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([{
	budget_id : '',
	category : '',
	value : '',
	startDate : '',
	endDate : '',
	isNew : true,
	isEditing : false
    }]);
    const [budget, setBudget] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
 

    const { user_id } = useParams();

    useEffect(() => {fetchBudget();}, []);

    const fetchBudget = async () => {
	const response = await axios.get(`http://127.0.0.1:5000/api/budget?user_id=${user_id}`);
	console.log(response.data);
	setBudget(response.data);
	const formattedRows = response.data.map(budget => ({
	    budget_id: budget.spending_id,
	    category: budget.category,
	    value: budget.amount.toString(), // Convert amount to string if necessary
	    startDate: new Date(budget.start_date).toISOString().split('T')[0],
	    endDate: new Date(budget.end_date).toISOString().split('T')[0],
	    isNew: false,
	    isEditing: false
	}));
	setRows([...formattedRows, 
	    {
		budget_id : '',
		category : '',
		value : '',
		startDate : '',
		endDate : '',
		isNew : true,
		isEditing : false
	    }]);
    };

    const addRow = () => {
	const lastRow = rows[rows.length - 1];
	if (lastRow['category'] !== '' && lastRow['value'] !== '') { 
	    setRows([...rows, 
		{
		    budget_id : '',
		    category : '',
		    value : '',
		    startDate : '',
		    endDate : '',
		    isNew : true,
		    isEditing : false
		}]);
	    setErrorMessage('')
	} else {
	    setErrorMessage('Please Fill in the Fields before adding a new Budget!')
	}
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
    
    const addBudget = async () => {
	const lastRow = rows[rows.length - 1];
	lastRow['user_id'] = user_id;
	if (lastRow.isNew && lastRow.category !== '' && lastRow.value !== '') {
	    try {
		await axios.post(`http://127.0.0.1:5000/api/category`, lastRow);
		lastRow.isNew = false;
		setBudget([...budget, lastRow]);
		addRow();
	    } catch (error) {
		console.error("Error while posting to budget: ", error);
	    }
	    setErrorMessage('')
	} else {
	    setErrorMessage('Cannot log in an empty budget.')
	}
    };

    const goDashboard = () => {
	navigate('/dashboard');
	navigate(0); // Add navigate(0) to make sure the navigatee page is refreshed once you go there
    };

    const editBudget = (index) => {
	const newRow = [...rows];
	newRow[index].isEditing = true;
	setRows(newRow);
    };

    const saveEditedBudget = async (index) => {
	const updatedRow = rows[index];
	try {
            await axios.put(`http://127.0.0.1:5000/api/category`, updatedRow);
            const newRow = [...rows];
            newRow[index].isEditing = false;
	    newRow[index].isNew = false;
            setRows(newRow);
        } catch (error) {
            console.error("Error while updating budget: ", error);
        }
    };

    const deleteBudget = async (index) => {
	const rowToBeDeleted = rows[index];
	try {
	    await axios.delete(`http://127.0.0.1:5000/api/category?spending_id=${rowToBeDeleted.budget_id}`);
	    setRows(rows.filter((_, i) => i !== index));
	} catch (error) {
	    console.error("Error while deleting budget: ", error);
	}
    };


    return (
	<div className="logbudgets">
	    <h2>Log Monthly Budget Categories</h2>
	    <div className="budget-table">
		<div className="table-row">
		    <div className="table-header">Categories</div>
		    <div className="table-header">Budget</div>
		    <div className="table-header">Actions</div>
		</div>
		{rows.map((row, index) => (
		    <div className="table-row" key={index}>
			{row.isEditing ? (
			    <>
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
				<button onClick={() => {saveEditedBudget(index);}}>
				    Save Edits
				</button>
			    </>
			) : (
			    <>
				{row.isNew ? (
				<>
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
				     <button onClick={() => {addBudget();}}>
					Log Budget
				    </button>
				</>
				) : (
				<>
				    <div>{row.category}</div>
				    <div>{row.value}</div>
				    <div className="buttons">
					<button onClick={() => {editBudget(index);}}>
					    Edit
					</button>
					<button onClick={() => {deleteBudget(index);}}>
					    Delete
					</button>
				    </div>
				</>
				)}
			    </>
			)}
		    </div>

		))}
		<div className="table-row">
		    <button className="button-1" onClick={() => {addRow();}}>+</button>
		</div>
		{errorMessage && <div className="error-message">{errorMessage}</div>}	
	    </div>
	    <div className="dashboard">
		<button className="button-dashboard" onClick={() => {goDashboard();}}>Dashboard</button>
	    </div>
	</div>
    );
}

export default LogBudgets;

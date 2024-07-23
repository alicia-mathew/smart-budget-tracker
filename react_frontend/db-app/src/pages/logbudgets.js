import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './logbudgets.css';
import { useParams } from 'react-router-dom';

function LogBudgets() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [newBudget, setNewBudget] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [canEditPermissions, setCanEditPermissions] = useState([]);
    const ind_id = JSON.parse(localStorage.getItem('user')).ind_id;

    const { user_id } = useParams();

    useEffect(() => {
        fetchBudget();
        fetchCanEdit();
    }, []);

    const fetchBudget = async () => {
        const response = await axios.get(`http://127.0.0.1:5000/api/budget?user_id=${user_id}`);
        const formattedRows = response.data.map(budget => ({
            budget_id: budget.spending_id,
            category: budget.category,
            value: budget.amount.toString(),
            isNew: false,
            isEditing: false
        }));
        setRows(formattedRows);
    };

    const fetchCanEdit = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/get_sg_permissions`, { "user_id": ind_id, "group_id": user_id });
            setCanEditPermissions(response.data);
        } catch (error) {
            console.error('There was an error fetching your editing permissions!', error);
        }
    };

    const handleCategoryChange = (index, value) => {
        if (index === -1) {
            setNewBudget({ ...newBudget, category: value });
        } else {
            const newRow = [...rows];
            newRow[index].category = value;
            setRows(newRow);
        }
    };

    const handleBudgetChange = (index, value) => {
        if (index === -1) {
            setNewBudget({ ...newBudget, value: value });
        } else {
            const newRow = [...rows];
            newRow[index].value = value;
            setRows(newRow);
        }
    };

    const addRow = () => {
        setNewBudget({ budget_id: '', category: '', value: '', isNew: true, isEditing: true });
        setErrorMessage('');
    };

    const saveNewBudget = async () => {
        const newRow = { ...newBudget, user_id: user_id };
        if (newRow.category !== '' && newRow.value !== '') {
            try {
                const response = await axios.post(`http://127.0.0.1:5000/api/category`, newRow);
                newRow.budget_id = response.data.budget_id; // Assuming response contains the new budget_id
                newRow.isNew = false;
                newRow.isEditing = false;
                setRows([...rows, newRow]);
                setNewBudget(null);
                setErrorMessage('');
            } catch (error) {
                console.error("Error while posting to budget: ", error);
            }
        } else {
            setErrorMessage('Cannot log in an empty budget.');
        }
    };

    const goDashboard = () => {
        navigate('/dashboard');
        navigate(0); // Add navigate(0) to make sure the navigated page is refreshed once you go there
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
            <header className="header">
                <h1>Budget Goal Management</h1>
            </header>
            <h3 className="intro" style={{ textAlign: 'center' }}>Welcome to your budget goal management sheet!</h3>
            <h3 className="intro" style={{ textAlign: 'center' }}>You can add, delete, and edit your spending budgets.</h3>
            <div className="budget-table">
                <div className="table-row">
                    <div className="table-header">Categories</div>
                    <div className="table-header">Budget ($)</div>
                    {canEditPermissions.create_sg ? (
                        <div className="table-header">Actions</div>
                    ) : null}
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
                                <button className="action-button" onClick={() => saveEditedBudget(index)}>
                                    Save Edits
                                </button>
                            </>
                        ) : (
                            <>
                                <div>{row.category}</div>
                                <div>{row.value}</div>
                                {canEditPermissions.create_sg ? (
                                    <div className="buttons">
                                        <button className="action-button" onClick={() => editBudget(index)}>
                                            Edit
                                        </button>
                                        <button className="action-button" onClick={() => deleteBudget(index)}>
                                            Delete
                                        </button>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                ))}
                {canEditPermissions.create_sg ? (
                    <>
                        {newBudget ? (
                            <div className="table-row">
                                <input
                                    type="text"
                                    value={newBudget.category}
                                    onChange={(e) => handleCategoryChange(-1, e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={newBudget.value}
                                    onChange={(e) => handleBudgetChange(-1, e.target.value)}
                                />
                                <button className="log-button" onClick={saveNewBudget}>
                                    Log Budget
                                </button>
                            </div>
                        ) : (
                            <div className="table-row">
                                <button className="add-button" onClick={addRow}>+</button>
                            </div>
                        )}
                    </>
                ) : null}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            <br />
            <button className="dashboard-button" onClick={goDashboard}>Return to Dashboard</button>
        </div>
    );
}

export default LogBudgets;

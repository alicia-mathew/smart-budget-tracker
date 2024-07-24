import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './expenses.css';
import { useParams } from 'react-router-dom';

function Expenses() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [lowerRange, setLowerRange] = useState('');
    const [upperRange, setUpperRange] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);
    const [canEditPermissions, setCanEditPermissions] = useState([]);
    const { user_id } = useParams();
    const ind_id = JSON.parse(localStorage.getItem('user')).ind_id;
    const [isClicked, setIsClicked] = useState(false);

    const handleSelectClicked = () => {
        setIsClicked(true);
    };

    const goDashboard = () => {
        navigate('/dashboard');
        navigate(0); // Add navigate(0) to make sure the navigated page is refreshed once you go there
    };

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchCanEdit();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get(`http://127.0.0.1:5000/api/categories?user_id=${user_id}`);
        setCategories(response.data);
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/expenses?user_id=${user_id}`);
            const expensesData = response.data.map(expense => ({
                ...expense,
                isNew: false,
                isEditing: false
            }));
            setExpenses(expensesData);
            setFilteredExpenses(expensesData);

            const uniqueMonths = [...new Set(expensesData.map(expense => new Date(expense.date).getMonth() + 1))];
            const uniqueYears = [...new Set(expensesData.map(expense => new Date(expense.date).getFullYear()))];
            setMonths(uniqueMonths);
            setYears(uniqueYears);
        } catch (error) {
            console.error('There was an error fetching the expenses!', error);
        }
    };

    const fetchCanEdit = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/get_expense_permissions`, { "user_id": ind_id, "group_id": user_id });
            setCanEditPermissions(response.data);
        } catch (error) {
            console.error('There was an error fetching your editing permissions!', error);
        }
    }

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newExpenses = [...filteredExpenses];
        newExpenses[index][name] = value;
        setFilteredExpenses(newExpenses);
    };

    const updateMainExpenses = (updatedExpenses) => {
        const newExpenses = expenses.map(expense => {
            const updatedExpense = updatedExpenses.find(e => e.expense_id === expense.expense_id);
            return updatedExpense ? updatedExpense : expense;
        });
        setExpenses(newExpenses);
    };

    const addRow = () => {
        const lastExpense = expenses[expenses.length - 1];
        if (lastExpense && lastExpense.description !== '' && lastExpense.amount !== '' && lastExpense.category !== '' && lastExpense.date !== '') {
            const newExpense = {
                expense_id: '',
                description: '',
                amount: '',
                category: '',
                date: '',
                isNew: true,
                isEditing: true
            };
            setFilteredExpenses([...filteredExpenses, newExpense]);
            setExpenses([...expenses, newExpense]);
            setErrorMessage('');
        } else {
            setErrorMessage('There was an error adding the expense! Please fill in all necessary fields.');
        }
    };

    const saveNewExpense = async (index) => {
        const newExpense = filteredExpenses[index];
        newExpense.user_id = user_id;
        if (newExpense.description !== '' && newExpense.amount !== '' && newExpense.category !== '' && newExpense.date !== '') {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/expenses', newExpense);
                console.log("Response from server:", response.data);
                const newFilteredExpenses = [...filteredExpenses];
                newFilteredExpenses[index] = { ...response.data, isNew: false, isEditing: false };
                setFilteredExpenses(newFilteredExpenses);
                updateMainExpenses(newFilteredExpenses);
                setErrorMessage('');
            } catch (error) {
                console.error('There was an error adding the expense!', error);
                setErrorMessage('There was an error adding the expense.');
            }
        } else {
            setErrorMessage('There was an error adding the expense! Please fill in all necessary fields.');
        }
    };

    const editExpense = (index) => {
        const newFilteredExpenses = [...filteredExpenses];
        newFilteredExpenses[index].isEditing = true;
        setFilteredExpenses(newFilteredExpenses);
    };

    const saveEditedExpense = async (index) => {
        const updatedExpense = filteredExpenses[index];
        try {
            await axios.put(`http://127.0.0.1:5000/api/expenses/${updatedExpense.expense_id}`, updatedExpense);
            const newFilteredExpenses = [...filteredExpenses];
            newFilteredExpenses[index].isEditing = false;
            setFilteredExpenses(newFilteredExpenses);
            updateMainExpenses(newFilteredExpenses);
        } catch (error) {
            console.error('There was an error updating the expense!', error);
        }
    };

    const deleteExpense = async (index) => {
        const expenseToDelete = filteredExpenses[index];
        try {
            if (!expenseToDelete.isNew) {
                await axios.delete(`http://127.0.0.1:5000/api/expenses/${expenseToDelete.expense_id}`);
            }
            const newFilteredExpenses = filteredExpenses.filter((_, i) => i !== index);
            setFilteredExpenses(newFilteredExpenses);
            setExpenses(expenses.filter((_, i) => i !== index));
        } catch (error) {
            console.error('There was an error deleting the expense!', error);
        }
    };

    const filterExpenses = () => {
        let filtered = expenses.filter(expense => {
            let matchesSearch = true;
            let matchesFilter = true;

            if (searchTerm) {
                matchesSearch = (
                    expense.description.toLowerCase().includes(searchTerm) ||
                    expense.amount.toString().includes(searchTerm) ||
                    expense.category.toLowerCase().includes(searchTerm) ||
                    expense.date.includes(searchTerm)
                );
            }

            if (filterType === 'amount') {
                matchesFilter = expense.amount >= lowerRange && expense.amount <= upperRange;
            } else if (filterType === 'category') {
                matchesFilter = expense.category === filterValue;
            } else if (filterType === 'month') {
                const expenseMonth = new Date(expense.date).getMonth() + 1; // JavaScript months are 0-11
                matchesFilter = expenseMonth === parseInt(filterMonth);
            } else if (filterType === 'year') {
                const expenseYear = new Date(expense.date).getFullYear();
                matchesFilter = expenseYear === parseInt(filterYear);
            }

            return matchesSearch && matchesFilter;
        });
        setFilteredExpenses(filtered);
    };

    useEffect(() => {
        filterExpenses();
    }, [searchTerm, filterType, filterValue, lowerRange, upperRange, filterMonth, filterYear]);

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        setIsClicked(false);
        setFilterValue('');
        setLowerRange('');
        setUpperRange('');
        setFilterMonth('');
        setFilterYear('');
    };

    return (
        <div className="expenses">
            <header className="header">
                <h1>Expense Management</h1>
            </header>
            <h3 className="intro" style={{ textAlign: 'center' }}>Welcome to your expense management sheet!</h3>
            <h3 className="intro" style={{ textAlign: 'center' }}>You can add, delete, edit, search, and filter your expenses.</h3>
            <form id="expenseForm" onSubmit={e => e.preventDefault()}>
                <div className="filter-section">
                    <input
                        className="common-style search-bar"
                        type="text"
                        placeholder="Search expenses..."
                        onChange={e => setSearchTerm(e.target.value.toLowerCase())}
                    />
                    <select className="common-style filter-dropdown" onChange={handleFilterChange} onClick={handleSelectClicked}>
                        {!isClicked ? (
                            <option value="">Filter By...</option>
                        ) : (
                            <option value="">None</option>
                        )}
                        <option value="amount">Amount Range</option>
                        <option value="category">Category</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>

                    {filterType === 'amount' && (
                        <>
                            <input
                                className="common-style filter-input"
                                type="number"
                                placeholder="Lower range"
                                value={lowerRange}
                                onChange={e => setLowerRange(e.target.value)}
                            />
                            <input
                                className="common-style filter-input"
                                type="number"
                                placeholder="Upper range"
                                value={upperRange}
                                onChange={e => setUpperRange(e.target.value)}
                            />
                        </>
                    )}
                    {filterType === 'category' && (
                        <select
                            className="common-style filter-input"
                            value={filterValue}
                            onChange={e => setFilterValue(e.target.value)}
                        >
                            <option value="">Select category</option>
                            {categories.map((category, idx) => (
                                <option key={idx} value={category}>{category}</option>
                            ))}
                        </select>
                    )}
                    {filterType === 'month' && (
                        <select
                            className="common-style filter-input"
                            value={filterMonth}
                            onChange={e => setFilterMonth(e.target.value)}
                        >
                            <option value="">Select month</option>
                            {months.map((month, idx) => (
                                <option key={idx} value={month}>{month}</option>
                            ))}
                        </select>
                    )}
                    {filterType === 'year' && (
                        <select
                            className="common-style filter-input"
                            value={filterYear}
                            onChange={e => setFilterYear(e.target.value)}
                        >
                            <option value="">Select year</option>
                            {years.map((year, idx) => (
                                <option key={idx} value={year}>{year}</option>
                            ))}
                        </select>
                    )}
                </div>
                <br></br>
                <div className="expense-list">
                    <div className="table-row">
                        <div className="table-header">Description</div>
                        <div className="table-header">Amount ($)</div>
                        <div className="table-header">Category</div>
                        <div className="table-header">Date</div>
                        {canEditPermissions.modify_exp ? (
                            <div className="table-header">Actions</div>
                        ) : null}
                    </div>
                    {filteredExpenses.map((expense, index) => (
                        <div className="table-row" key={index}>
                            {expense.isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="description"
                                        value={expense.description}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="input-description"
                                    />
                                    <input
                                        type="text"
                                        name="amount"
                                        value={expense.amount}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="input-amount"
                                    />
                                    <select
                                        name="category"
                                        value={expense.category}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="input-category"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category, idx) => (
                                            <option key={idx} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        name="date"
                                        value={expense.date}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="input-date"
                                    />
                                    {expense.isNew ? (
                                        <button className="addExp-button" onClick={() => saveNewExpense(index)}>Add Expense</button>
                                    ) : (
                                        <button className="saveEdits-button" onClick={() => saveEditedExpense(index)}>Save Edits</button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="input-description1">{expense.description}</div>
                                    <div className="input-amount1">{expense.amount}</div>
                                    <div className="input-category1">{expense.category}</div>
                                    <div className="input-date1">{expense.date}</div>
                                    {canEditPermissions.modify_exp ? (
                                        <div className="buttons">
                                            <button className="action-button" onClick={() => editExpense(index)}>Edit</button>
                                            <button className="action-button" onClick={() => deleteExpense(index)}>Delete</button>
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                    ))}
                    {canEditPermissions.add_exp ? (
                        <div className="table-row">
                            <button className="addnew-button" onClick={addRow}>+</button>
                        </div>
                    ) : null}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
            </form>
            <br></br>
            <button className="dashboard-button" onClick={goDashboard}>Return to Dashboard</button>
        </div>
    );
}

export default Expenses;

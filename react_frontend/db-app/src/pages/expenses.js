import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './expenses.css';
import { useParams } from 'react-router-dom';

function Expenses() {
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editedExpense, setEditedExpense] = useState({
        description: '',
        amount: '',
        category: '',
        date: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const { user_id } = useParams();

    useEffect(() => {
        fetchExpenses();
	fetchCategories();
    }, []);


    const fetchCategories = async () => {
	const response = await axios.get(`http://127.0.0.1:5000/api/categories?user_id=${user_id}`);
	console.log(response.data);
	setCategories(response.data);
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/expenses?user_id=${user_id}`);
            setExpenses(response.data);
        } catch (error) {
            console.error('There was an error fetching the expenses!', error);
        }
    };

    const addExpense = async (event) => {
        event.preventDefault();

        const desc = document.getElementById("expenseFormDescription").value;
        const amt = document.getElementById("expenseFormAmount").value;
        const cat = document.getElementById("expenseFormCategory").value;
        const date = document.getElementById("expenseFormDate").value;

        const newExpense = {
            description: desc,
            amount: parseFloat(amt),
            category: cat,
            date: date,
            user_id: user_id
        };

        console.log("Sending new expense:", newExpense);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/expenses', newExpense);
            console.log("Response from server:", response.data);
            setExpenses(prevExpenses => [...prevExpenses, response.data]);
            console.log("Updated expenses state:", expenses);
            document.getElementById("expenseForm").reset();
        } catch (error) {
            console.error('There was an error adding the expense!', error);
        }
    };

    const deleteExpense = async (expense_id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/api/expenses/${expense_id}`);
            if (response.data.status === 'success') {
                setExpenses(prevExpenses => prevExpenses.filter(expense => expense.expense_id !== expense_id));
            }
        } catch (error) {
            console.error('There was an error deleting the expense!', error);
        }
    };

    const editExpense = (expense) => {
        setEditingExpense(expense.expense_id);
        setEditedExpense({ ...expense });
    };

    const saveEditedExpense = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://127.0.0.1:5000/api/expenses/${editingExpense}`, editedExpense);
            if (response.data.status === 'success') {
                setExpenses(prevExpenses => prevExpenses.map(expense =>
                    expense.expense_id === editingExpense ? editedExpense : expense
                ));
                setEditingExpense(null);
                setEditedExpense({});
            }
        } catch (error) {
            console.error('There was an error updating the expense!', error);
        }
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditedExpense(prevExpense => ({
            ...prevExpense,
            [name]: value
        }));
    };

    return (
        <div className="expenses">
            <header className="header">
                <h1>Expense Management</h1>
            </header>

            <form id="expenseForm" onSubmit={addExpense}>
                <h2>Add an Expense</h2>
                <label>Description: 
                    <input 
                        type="text"
                        name="description"
                        id="expenseFormDescription"
                        required
                    />
                </label>

                <label>Amount $:
                    <input 
                        type="text"
                        name="amount"
                        id="expenseFormAmount"
                        required
                    />
                </label>

                <label>Category: 
                    <select 
                        name="category"
                        id="expenseFormCategory"
                        required
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </label>

                <label>Date: 
                    <input
                        type="date"
                        name="date"
                        id="expenseFormDate"
                        required
                    />
                </label>

                <button type="submit">Add Expense</button>
            </form>

            {editingExpense && (
                <form onSubmit={saveEditedExpense}>
                    <h2>Edit Expense</h2>
                    <label>Description: 
                        <input 
                            type="text"
                            name="description"
                            value={editedExpense.description}
                            onChange={handleEditChange}
                            required
                        />
                    </label>

                    <label>Amount $:
                        <input 
                            type="text"
                            name="amount"
                            value={editedExpense.amount}
                            onChange={handleEditChange}
                            required
                        />
                    </label>

                    <label>Category: 
                        <select 
                            name="category"
                            value={editedExpense.category}
                            onChange={handleEditChange}
                            required
                        >
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </label>

                    <label>Date: 
                        <input
                            type="date"
                            name="date"
                            value={editedExpense.date}
                            onChange={handleEditChange}
                            required
                        />
                    </label>

                    <button type="submit">Save Changes</button>
                </form>
            )}

            <div className="expense-list">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Actions</th>  {/* New column for actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.expense_id}>
                                <td>{expense.description}</td>
                                <td>{expense.amount}</td>
                                <td>{expense.category}</td>
                                <td>{expense.date}</td>
                                <td>
                                    <button onClick={() => editExpense(expense)}>Edit</button>
                                    <button onClick={() => deleteExpense(expense.expense_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
                        }
export default Expenses;

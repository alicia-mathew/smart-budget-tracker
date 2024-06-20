import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

function Dashboard() {
    const categories = ["Rent", "Groceries", "Clothes", "Other"];
    const [expenses, setExpenses] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('/api/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('There was an error fetching the expenses!', error);
        }
    };

    const addExpense = async (event) => {
        event.preventDefault();
        const expenseList = document.getElementById("expenseList");

        const desc = document.getElementById("expenseFormDescription").value;
        const amt = document.getElementById("expenseFormAmount").value;
        const cat = document.getElementById("expenseFormCategory").value;
        const date = document.getElementById("expenseFormDate").value;

        const newId = expenseList.children.length ? parseInt(expenseList.lastChild.id.split("_")[1]) + 1 : 0;
        const newExpense = {
            expense_id: `expense_${newId}`,
            amount: parseFloat(amt),
            category: cat,
            date: date,
            user_id: user.ind_id,  // Use the logged-in user's ID
            description: desc
        };

        try {
            const response = await axios.post('/api/expenses', newExpense);
            setExpenses([...expenses, response.data]);
            document.getElementById("expenseForm").reset();
        } catch (error) {
            console.error('There was an error adding the expense!', error);
        }
    };

    return (
        <div className="dashboard">
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

            <div id="expenseList">
                {expenses.map(expense => (
                    <div key={expense.expense_id} id={expense.expense_id} className="expense-item">
                        <p>{expense.description}</p>
                        <p>{expense.amount}</p>
                        <p>{expense.category}</p>
                        <p>{expense.date}</p>
                        {/* Add edit and delete functionality if needed */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;

// import React, { useState } from 'react';
// import axios from 'axios';
// import './dashboard.css';

// function Dashboard() {
//     const categories = ["Rent", "Groceries", "Clothes", "Other"];
//     const [expenses, setExpenses] = useState([]);

//     const fetchExpenses = async () => {
//         try {
//             const response = await axios.get('/api/expenses');
//             setExpenses(response.data);
//         } catch (error) {
//             console.error('There was an error fetching the expenses!', error);
//         }
//     };

//     const addExpense = async (event) => {
//         event.preventDefault();
//         const expenseList = document.getElementById("expenseList");

//         const desc = document.getElementById("expenseFormDescription").value;
//         const amt = document.getElementById("expenseFormAmount").value;
//         const cat = document.getElementById("expenseFormCategory").value;
//         const date = document.getElementById("expenseFormDate").value;

//         const newId = expenseList.children.length ? parseInt(expenseList.lastChild.id.split("_")[1]) + 1 : 0;
//         const newExpense = {
//             expense_id: `expense_${newId}`,
//             amount: parseFloat(amt),
//             category: cat,
//             date: date,
//             user_id: 'someUserId', // replace with the actual user ID
//             description: desc
//         };

//         try {
//             const response = await axios.post('/api/expenses', newExpense);
//             setExpenses([...expenses, response.data]);
//             document.getElementById("expenseForm").reset();
//         } catch (error) {
//             console.error('There was an error adding the expense!', error);
//         }
//     };

//     return (
//         <div className="dashboard">
//             <header className="header">
//                 <h1>Expense Management</h1>
//             </header>

//             <form id="expenseForm" onSubmit={addExpense}>
//                 <h2>Add an Expense</h2>
//                 <label>Description: 
//                     <input 
//                         type="text"
//                         name="description"
//                         id="expenseFormDescription"
//                         required
//                     />
//                 </label>

//                 <label>Amount $:
//                     <input 
//                         type="text"
//                         name="amount"
//                         id="expenseFormAmount"
//                         required
//                     />
//                 </label>

//                 <label>Category: 
//                     <select 
//                         name="category"
//                         id="expenseFormCategory"
//                         required
//                     >
//                         {categories.map((category, index) => (
//                             <option key={index} value={category}>{category}</option>
//                         ))}
//                     </select>
//                 </label>

//                 <label>Date: 
//                     <input
//                         type="date"
//                         name="date"
//                         id="expenseFormDate"
//                         required
//                     />
//                 </label>

//                 <button type="submit">Add Expense</button>
//             </form>

//             <div id="expenseList">
//                 {expenses.map(expense => (
//                     <div key={expense.expense_id} id={expense.expense_id} className="expense-item">
//                         <p>{expense.description}</p>
//                         <p>{expense.amount}</p>
//                         <p>{expense.category}</p>
//                         <p>{expense.date}</p>
//                         {/* Add edit and delete functionality if needed */}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Dashboard;

// import React, { useState } from 'react';
// import './dashboard.css';

// function Dashboard() {
//     // Expense categories
//     const categories = ["Rent", "Groceries", "Clothes", "Other"];

//     // Function to add an expense
//     const addExpense = (event) => {
//         event.preventDefault();
//         const expenseList = document.getElementById("expenseList");

//         // Extract values from form
//         const desc = document.getElementById("expenseFormDescription").value;
//         const amt = document.getElementById("expenseFormAmount").value;
//         const cat = document.getElementById("expenseFormCategory").value;
//         const date = document.getElementById("expenseFormDate").value;

//         // Clear the form
//         const expenseForm = document.getElementById("expenseForm");
//         expenseForm.reset();

//         // Create a new expense element
//         const newId = expenseList.children.length ? parseInt(expenseList.lastChild.id.split("_")[1]) + 1 : 0;
//         const expense = document.createElement("div");
//         expense.id = `expense_${newId}`;
//         expense.className = "expense-item";

//         expense.innerHTML = `
//             <p id="expense_description_${newId}">${desc}</p>
//             <p id="expense_amount_${newId}">${amt}</p>
//             <p id="expense_category_${newId}">${cat}</p>
//             <p id="expense_date_${newId}">${date}</p>
//             <button id="expense_edit_${newId}">Edit</button>
//             <button id="expense_delete_${newId}">Delete</button>
//         `;

//         // Add event listeners for edit and delete buttons
//         expense.querySelector(`#expense_edit_${newId}`).addEventListener('click', () => editExpense(newId));
//         expense.querySelector(`#expense_delete_${newId}`).addEventListener('click', () => deleteExpense(newId));

//         // Append the new expense to the list
//         expenseList.appendChild(expense);

//         // Add the new expense to the database (implement this functionality)
//     };

//     const editExpense = (id) => {
//         // Implement edit functionality here
//     };

//     const deleteExpense = (id) => {
//         // Remove the expense from the DOM
//         const expense = document.getElementById(`expense_${id}`);
//         expense.remove();

//         // Remove the expense from the database (implement this functionality)
//     };

//     return (
//         <div className="dashboard">
//             <header className="header">
//                 <h1>Expense Management</h1>
//             </header>

//             <form id="expenseForm" onSubmit={addExpense}>
//                 <h2>Add an Expense</h2>
//                 <label>Description: 
//                     <input 
//                         type="text"
//                         name="description"
//                         id="expenseFormDescription"
//                         required
//                     />
//                 </label>

//                 <label>Amount $:
//                     <input 
//                         type="text"
//                         name="amount"
//                         id="expenseFormAmount"
//                         required
//                     />
//                 </label>

//                 <label>Category: 
//                     <select 
//                         name="category"
//                         id="expenseFormCategory"
//                         required
//                     >
//                         {categories.map((category, index) => (
//                             <option key={index} value={category}>{category}</option>
//                         ))}
//                     </select>
//                 </label>

//                 <label>Date: 
//                     <input
//                         type="date"
//                         name="date"
//                         id="expenseFormDate"
//                         required
//                     />
//                 </label>

//                 <button type="submit">Add Expense</button>
//             </form>

//             <div id="expenseList"></div>
//         </div>
//     );
// }

// export default Dashboard;

// import React, { useState } from 'react';
// import './dashboard.css';

// function Dashboard() {
// 	// pull expense categories from db
// 	// categories = get_categories(userID)
// 	const categories = ["Rent", "Groceries", "Clothes", "Other"];

// 	// render category dropdown
// 	var categoryOptions = [];
// 	for (let category of categories) {
// 		categoryOptions.push(<option>{category}</option>);
// 	};
	
//     const addExpense = (event) => {
// 		// adds an expense to the expense list
// 		event.preventDefault();
// 		var expense_list = document.getElementById("expenseList");

// 		// extract values from form
// 		const input_desc = document.getElementById("expenseFormDescription").value;
// 		const input_amt = document.getElementById("expenseFormAmount").value;
// 		const input_cat = document.getElementById("expenseFormCategory").value;
// 		const input_date = document.getElementById("expenseFormDate").value;

// 		// clear the form
// 		var expenseForm = document.getElementById("expenseForm");
// 		for (let child of expenseForm.children) {
// 			if (child.children.length > 0) {
// 				// clear this attribute
// 				child.children[0].value = "";
// 			}
// 		}

// 		// create a new expense object
// 		// expense data
// 		var expenses = expense_list.children;
// 		var newId = 0;
// 		if (expenses.length > 0) {
// 			newId = parseInt(expenses[expenses.length - 1].id.split("_")[1]) + 1;
// 		}
// 		var expense = document.createElement("div");
// 		expense.style.backgroundColor = "blue";
// 		expense.id = "expense_" + newId;
// 		var expense_desc = document.createElement("p");
// 		expense_desc.id = "expense_description_" + newId;
// 		expense_desc.textContent = input_desc;
// 		var expense_amt = document.createElement("p");
// 		expense_amt.textContent = input_amt;
// 		expense_amt.id = "expense_amount_" + newId;
// 		var expense_cat = document.createElement("p");
// 		expense_cat.textContent = input_cat;
// 		expense_cat.id = "expense_category_" + newId;
// 		var expense_date = document.createElement("p");
// 		expense_date.textContent = input_date;
// 		expense_date.id = "expense_date_" + newId;
// 		expense.appendChild(expense_desc);
// 		expense.appendChild(expense_amt);
// 		expense.appendChild(expense_cat);
// 		expense.appendChild(expense_date);

// 		// expense edit and delete buttons
// 		var expense_edit = document.createElement("button");
// 		expense_edit.textContent = "Edit"
// 		expense_edit.id = "expense_edit_" + newId;
// 		expense_edit.addEventListener('click', function() {
// 			var expense = document.getElementById("expense_"+newId);
// 			// remove edit and delete buttons
// 			var expense_edit = document.getElementById("expense_edit_"+newId);
// 			expense_edit.hidden = true;
// 			var expense_delete = document.getElementById("expense_delete_"+newId);
// 			expense_delete.hidden = true;

// 			// replace static values with editable inputs
// 			// expense form
// 			var new_expense_form = document.createElement("form");

// 			// expense description
// 			var expense_desc = document.getElementById("expense_description_"+newId);
// 			const expense_desc_value = expense_desc.textContent;
// 			expense_desc.hidden = true;
// 			var expense_desc_input = document.createElement("input");
// 			expense_desc_input.type = "text";
// 			expense_desc_input.value = expense_desc_value;
// 			expense_desc_input.required = true;
// 			expense_desc_input.id = "edit_expense_description_"+newId;

// 			// expense amount
// 			var expense_amt = document.getElementById("expense_amount_"+newId);
// 			const expense_amt_value = expense_amt.textContent;
// 			expense_amt.hidden = true;
// 			var expense_amt_input = document.createElement("input");
// 			expense_amt_input.type = "text";
// 			expense_amt_input.value = expense_amt_value;
// 			expense_amt_input.required = true;
// 			expense_amt_input.id = "edit_expense_amount_"+newId;

// 			// expense category
// 			var expense_cat = document.getElementById("expense_category_"+newId);
// 			const expense_cat_value = expense_cat.textContent;
// 			expense_cat.hidden = true;
// 			var expense_cat_input = document.createElement("select");
// 			for (let category of categories) {
// 				var opt = document.createElement("option");
// 				opt.textContent = category;
// 				expense_cat_input.appendChild(opt);
// 			}
// 			expense_cat_input.required = true;
// 			expense_cat_input.id = "edit_expense_category_"+newId;

// 			// expense date
// 			var expense_date = document.getElementById("expense_date_"+newId);
// 			const expense_date_value = expense_date.textContent;
// 			expense_date.hidden = true;
// 			var expense_date_input = document.createElement("input");
// 			expense_date_input.type = "date";
// 			expense_date_input.value = expense_date_value;
// 			expense_date_input.required = true;
// 			expense_date_input.id = "edit_expense_date_"+newId;

// 			// add new inputs to expense
// 			new_expense_form.appendChild(expense_desc_input);
// 			new_expense_form.appendChild(expense_amt_input);
// 			new_expense_form.appendChild(expense_cat_input);
// 			new_expense_form.appendChild(expense_date_input);
// 			expense.appendChild(new_expense_form);

// 			// create cancel and confirm buttons
// 			var cancel_edit = document.createElement("button");
// 			var confirm_edit = document.createElement("input");
// 			cancel_edit.textContent = "Cancel"
// 			cancel_edit.addEventListener('click', function() {
// 				//unhide all static elements
// 				expense_edit.hidden = false;
// 				expense_delete.hidden = false;
// 				expense_desc.hidden = false;
// 				expense_amt.hidden = false;
// 				expense_cat.hidden = false;
// 				expense_date.hidden = false;

// 				// remove all form elements
// 				expense_desc_input.remove();
// 				expense_amt_input.remove();
// 				expense_cat_input.remove();
// 				expense_date_input.remove();
// 				cancel_edit.remove();
// 				confirm_edit.remove();
// 			});
// 			confirm_edit.type = "submit";
// 			confirm_edit.addEventListener('click', function() {
// 				// get new values from form input
// 				const new_desc = expense_desc_input.value;
// 				const new_amt = expense_amt_input.value;
// 				const new_cat = expense_cat_input.value;
// 				const new_date = expense_date_input.value;

// 				//unhide all static elements
// 				expense_edit.hidden = false;
// 				expense_delete.hidden = false;
// 				expense_desc.hidden = false;
// 				expense_amt.hidden = false;
// 				expense_cat.hidden = false;
// 				expense_date.hidden = false;

// 				// update all static elements with new values
// 				expense_desc.textContent = new_desc;
// 				expense_amt.textContent = new_amt;
// 				expense_cat.textContent = new_cat;
// 				expense_date.textContent = new_date;

// 				// remove all form elements
// 				expense_desc_input.remove();
// 				expense_amt_input.remove();
// 				expense_cat_input.remove();
// 				expense_date_input.remove();
// 				cancel_edit.remove();
// 				confirm_edit.remove();
// 			});

// 			// append the cancel and confirm buttons
// 			expense.appendChild(cancel_edit);
// 			expense.appendChild(confirm_edit);
// 		});
		
// 		var expense_delete = document.createElement("button");
// 		expense_delete.textContent = "Delete"
// 		expense_delete.id = "expense_delete_" + newId;
// 		expense_delete.addEventListener('click', function() {
// 			// remove the expense from the DOM
// 			var expense = document.getElementById("expense_"+newId);
// 			expense.remove();

// 			// remove the expense from our DB
// 		});
// 		expense.appendChild(expense_edit);
// 		expense.appendChild(expense_delete);
		
// 		// add the new expense to the expense list
// 		expense_list.appendChild(expense);

// 		// add the new expense to our DB
// 	}


//     return (
// 	<div className="Dashboard">
// 	    <header className="header">
// 			<h1>Expense Management</h1>
// 	    </header>
		
// 		<form id="expenseForm" onSubmit={addExpense}>
// 			<h2>Add an Expense</h2>
// 			<label>Description: 
// 				<input 
// 					type="text"
// 					name="description"
// 					id="expenseFormDescription"
// 					required
// 				/>
// 			</label>

// 			<label>Amount $
// 				<input 
// 					type="text"
// 					name="amount"
// 					id="expenseFormAmount"
// 					required
// 				/>
// 			</label>

// 			<label>Category: 
// 				<select 
// 					name="category"
// 					id="expenseFormCategory"
// 					required
// 				>
// 					{categoryOptions}
// 				</select>
// 			</label>

// 			<label>Date: 
// 				<input
// 					type="date"
// 					name="date"
// 					id="expenseFormDate"
// 					required>
// 				</input>
// 			</label>

// 			<input type="submit" />
// 		</form>

// 	    <div id="expenseList">
// 	    </div>
// 	</div>
//     );
// }

// export default Dashboard;

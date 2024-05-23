import React, { useState } from 'react';
import './dashboard.css';

function Dashboard() {
    // useState checks if the button has been clicked (in this case)
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
	setDropdownVisible(!dropdownVisible);
    };
    return (
	<div className="Dashboard">
	    <header className="header">
		<h1>Budget Tracker</h1>
		<div className="account-container">
		    <button className="account-button" onClick={toggleDropdown}>
			<span className="account-icon">⚪</span> Account
		    </button>
		    {dropdownVisible && (
			<div className="dropdown">
			<button className="dropdown-option">Profile</button>
			<button className="dropdown-option">Settings</button>
			<button className="dropdown-option">Logout</button>
			</div>
		    )}
		</div>
	    </header>
	    <div className="content">
		<div className="section">
		    <h2>Log Budget Goals</h2>
		    <p1>Log and split expenditure budget into categories</p1>
		</div>
		<div className="section">
		    <h2>Expense Management</h2>
		    <p1>Log your Expenses and compare them alongside your allotted budgeting</p1>
		</div>
		<div className="section">
		    <h2>Trends</h2>
		</div>
		<div className="section">
		    <h2>Smart Recommendations</h2>
		</div>
	    </div>
	</div>
    );
}

export default Dashboard;

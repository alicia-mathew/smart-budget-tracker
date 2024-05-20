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
		    <h2>Monthly</h2>
		</div>
		<div className="section">
		    <h2>Yearly</h2>
		</div>
		<div className="section">
		    <h2>Expenditure by Card</h2>
		</div>
	    </div>
	</div>
    );
}

export default Dashboard;

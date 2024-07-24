import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';
import { wait } from '@testing-library/user-event/dist/utils';

function Dashboard() {
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [groups, setGroups] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [selectedDashboard, setSelectedDashboard] = useState('Personal');
    const [selectedUser, setSelectedUser] = useState(user.ind_id);

    useEffect(() => {
		fetchUser();
		fetchGroups();
    }, []);

    const fetchUser = async() => {
		try {
			const user_id = user.ind_id
			const response = await axios.get(`http://127.0.0.1:5000/api/username?user_id=${user_id}`);
			setUsername(response.data);
		} catch (error) {
			console.log("there was an error in fetching", error);
		}
    };

	const fetchGroups = async() => {
		try {
			const user_id = user.ind_id
			const response = await axios.get(`http://127.0.0.1:5000/api/user_groups?user_id=${user_id}`);
			setGroups(response.data);
		} catch (error) {
			console.log("there was an error in fetching", error);
		}
    };

    const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);
    };

    const routePage = (page) => {
	navigate(page);
	navigate(0)
    };

    const changeSelectedDashboard = (event) => {
	if (event.target.value === 'Personal') {
	    setSelectedUser(user.ind_id);
	    setSelectedDashboard(event.target.value);
	} else {
	    const value = JSON.parse(event.target.value);
	    console.log(value);
	    setSelectedDashboard(value.name);
	    setSelectedUser(value.id);
	}
    }

    return (
	<div className="Dashboard">
		<header className="header">
            <h1>Smart Budget Tracker</h1>
		<div className="account-container">
		    <button className="account-button" onClick={toggleDropdown}>
			<span className="account-icon">📊</span> {username}
		    </button>
		    {dropdownVisible && (
			<div className="dropdown">
			    <button className="dropdown-option" onClick={() => routePage('/home')}>Logout</button>
			</div>
		    )}
		</div>
	    </header>
		{<div className="dashboard-heading">
            {selectedDashboard === 'Personal' ? (
                <h2>Welcome to {username}'s Dashboard!</h2>
            ) : (
                <h2>Welcome to {selectedDashboard}'s Dashboard!</h2>
            )}
        </div>}
		<div className="intro-paragraph">
                <p> 
					This is your main dashboard! Here, you can manage your personal budget goals, track your expenses, visualize your spending patterns, and benefit from smart, personalized suggestions on how to save more. You can also create your own group or join an existing one and manage all your expenses in one place!
				</p>
				<p>
					To get started, choose your dashboard and then select a section below to explore the features designed to help you manage your finances efficiently.
				</p>
        </div>
        <div className="groups-container">
            <label>Select Dashboard:</label>
            <select className="select-dashboard" onChange={changeSelectedDashboard}>
				<option value="Personal">Personal</option>
                {groups.map(group => (
                    <option key={group.group_id} value={JSON.stringify({ name: group.name, id: group.group_id })}>{group.name}</option>
                ))}
            </select>
        </div>
		<br></br>
	    <div className="content">
			<div className="section" onClick={() => routePage(`/logbudgets/${selectedUser}`)}>
				<h2>Budget Goal Management</h2>
				<p>Start by splitting your expenditure budgets into categories and logging your budget goals.</p>
			</div>
			<div className="section" onClick={() => routePage(`/expenses/${selectedUser}`)}>
				<h2>Expense Management</h2>
				<p>Log and manage all your expenses at once.</p>
			</div>
			<div className="section" onClick={() => routePage(`/trends/${selectedUser}`)}>
				<h2>Visualize Spending Patterns</h2>
				<p>Take a look at your spending trends.</p>
			</div>
			<div className="section" onClick={() => routePage(`/smart_suggestions/${selectedUser}`)}>
				<h2>Smart Suggestions</h2>
				<p>Get some insights and suggestions on how to spend more efficiently and save more!</p>
			</div>
			<div className="section" onClick={() => routePage('/savings_leaderboard/')}>
				<h2>Savings Leaderboard</h2>
				<p>Find out who the top saver is amongst your friends!</p>
			</div>
			<div className="section" onClick={() => routePage('/groups')}>
				<h2>Group Management</h2>
				<p>Manage and view your group-wide spending activity, join new group or create your own!</p>
			</div>
		</div>
	</div>
    );
}

export default Dashboard;

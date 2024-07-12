import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';
import { wait } from '@testing-library/user-event/dist/utils';

function Dashboard() {
    const navigate = useNavigate();
    // useState checks if the button has been clicked (in this case)
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [username, setUsername] = useState('');
	const [groups, setGroups] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
	const [selectedDashboard, setSelectedDashboard] = useState(user.ind_id);

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
		const {value} = event.target;
		setSelectedDashboard(value);
	}
    
    return (
	<div className="Dashboard">
	    <header className="header">
		<h1>Budget Tracker</h1>
		<div className="groups-container">
			<label>
				Select Dashboard:
			</label>
		    <select onChange={changeSelectedDashboard}>
				<option key={user.ind_id} value="Personal">Personal</option>
				{groups.map(group => (
                            <option key={group.group_id} value={group.group_id}>{group.name}</option>
                ))}
			</select>
		</div>
		<div className="account-container">
		    <button className="account-button" onClick={toggleDropdown}>
			<span className="account-icon">📊</span> {username}
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
		<div className="section" onClick={() => routePage(`/logbudgets/${selectedDashboard}`)}>
		    <h2>Log Budget Goals</h2>
		    <p1>Log and split expenditure budget into categories</p1>
		</div>
		<div className="section" onClick={() => routePage(`/expenses/${selectedDashboard}`)}>
		    <h2>Expense Management</h2>
		    <p1>Log your Expenses and compare them alongside your allotted budgeting</p1>
		</div>
		<div className="section" onClick={() => routePage(`/trends/${selectedDashboard}`)}>
		    <h2>Trends</h2>
		</div>
		<div className="section" onClick={() => routePage(`/smart_suggestions/${selectedDashboard}`)}>
		    <h2>Smart Suggestions</h2>
		</div>
		<div className="section" onClick={() => routePage('/savings_leaderboard/')}>
		    <h2>Savings Leaderboard</h2>
		</div>
		<div className="section" onClick={() => routePage('/groups')}>
		    <h2>Group Management</h2>
		</div>
	    </div>
	</div>
    );
}

export default Dashboard;

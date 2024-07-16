import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './leaderboard.css';

function Leaderboard() {
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        try {
            const leaderboard_response = await axios.get(`http://127.0.0.1:5000/api/leaderboard`);
            setLeaders(leaderboard_response.data);
        } catch (error) {
            console.error('There was an error fetching the leaderboard!', error);
        }
    }

    const goDashboard = () => {
	navigate('/dashboard');
	navigate(0); // Add navigate(0) to make sure the navigatee page is refreshed once you go there
    };

    return (
        <div>
            <h1>Savings Leaderboard</h1>
            <table className='expense-list'>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Amount Under Budget</th>
                    </tr>
                </thead>
                <tbody>
                    {leaders.map((leader, index) => (
                        <tr>
                            <td>{index+1}</td>
                            <td>{leader.name}</td>
                            <td>{"$" + leader.net_savings}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
	    <br/>
	    <button className="dashboard-button" onClick={() => {goDashboard();}}>Return to Dashboard</button>
        </div>
    );
}
export default Leaderboard;

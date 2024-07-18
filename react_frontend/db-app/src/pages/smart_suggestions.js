import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './smart_suggestions.css';
import { useParams, useNavigate } from 'react-router-dom';

function SmartSuggestions() {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const { user_id } = useParams();

    useEffect(() => {
        fetchSmartSuggestions();
    }, []);

    const fetchSmartSuggestions = async () => {
        try {
            const leaderboard_response = await axios.get(`http://127.0.0.1:5000/api/smart_suggestions?user_id=${user_id}`);
            setSuggestions(leaderboard_response.data);
        } catch (error) {
            console.error('There was an error fetching the smart suggestions!', error);
        }
    }

    const goDashboard = () => {
	navigate('/dashboard');
	navigate(0); // Add navigate(0) to make sure the navigatee page is refreshed once you go there
    };
    
    return (
        <div>
            <h1>Smart Suggestions</h1>
            <table>
                <thead>
                    <tr>
                        <th className="table-header"></th>
                        <th className="table-header">Category</th>
                        <th className="table-header">Suggestion</th>
                    </tr>
                </thead>
                <tbody className='expense-list'>
                    {suggestions.map((suggestion, index) => (
                        <tr>
                            <td>{index+1}</td>
                            <td>{suggestion.category}</td>
                            <td>{suggestion.text}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
	    <br/>
	    <button className="dashboard-button" onClick={() => {goDashboard();}}>Return to Dashboard</button>
        </div>
    );
}
export default SmartSuggestions;

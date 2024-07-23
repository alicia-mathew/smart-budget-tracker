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
    };

    const goDashboard = () => {
        navigate('/dashboard');
        navigate(0); // Add navigate(0) to make sure the navigated page is refreshed once you go there
    };

    return (
        <div className="smart-suggestions">
            <header className="header">
                <h1>Smart Suggestions</h1>
            </header>
            <h3 className="intro" style={{ textAlign: 'center' }}>Here are some smart suggestions for you.</h3>
            <div className="table-section">
                <div className="table-row">
                    <div className="table-header">#</div>
                    <div className="table-header">Category</div>
                    <div className="table-header">Suggestion</div>
                </div>
                {suggestions.map((suggestion, index) => (
                    <div className="table-row" key={index}>
                        <div>{index + 1}</div>
                        <div>{suggestion.category}</div>
                        <div>{suggestion.text}</div>
                    </div>
                ))}
            </div>
            <br />
            <button className="dashboard-button" onClick={goDashboard}>Return to Dashboard</button>
        </div>
    );
}

export default SmartSuggestions;

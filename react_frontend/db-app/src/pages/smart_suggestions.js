import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './smart_suggestions.css';
import { useParams } from 'react-router-dom';

function SmartSuggestions() {
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
    
    return (
        <div>
            <h1>Smart Suggestions</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Suggestion</th>
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
        </div>
    );
                        }
export default SmartSuggestions;

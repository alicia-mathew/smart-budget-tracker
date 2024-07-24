import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';

function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const routeDashboard = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth', { email, password });
            if (response.data.status === "success") {
                const user = response.data.user;
                localStorage.setItem('user', JSON.stringify(user));  // Save user details in localStorage
                navigate('/dashboard');
                navigate(0);
            } else {
                alert('Invalid login credentials. Please try again.');
            }
        } catch (error) {
            alert('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="home">
            <h1>Welcome to Smart Budget Tracker</h1>
            <h3>Enter your email and password to log in!</h3>
            <br></br>
                <input
                    className="input-style"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br></br> <br></br>
                <input
                    className="input-style"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            <br></br>  <br></br> 
            <div className="buttons">
                <button className="login-button" onClick={routeDashboard}>Log In</button>
            </div>
        </div>
    );
}

export default Home;

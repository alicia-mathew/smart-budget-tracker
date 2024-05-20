import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // useNavigate essentially routes the page to the given path
    // will need to add a user login details check
    const routeDashboard = () => {
	navigate('/dashboard');
	navigate(0);
    };
     
    return (
	<div className="home">
	    <h2>Welcome to Budget Tracker</h2>
	    <div className="form">
		<input
		  type="email"
		  placeholder="Email"
		  value={email}
		  onChange={(e) => setEmail(e.target.value)}
		/>
		<input
		  type="password"
		  placeholder="Password"
		  value={password}
		  onChange={(e) => setPassword(e.target.value)}
		/>
	    </div>
	    <button className="login" onClick={routeDashboard}>
		<span className="login-button">Log In</span>
	    </button>
	</div>
    );
}

export default Home;

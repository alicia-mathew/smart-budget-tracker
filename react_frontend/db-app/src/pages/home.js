import React, { useState } from 'react';
import './home.css';

function Home() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
	    </div>
	);
}

export default Home;

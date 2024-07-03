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

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './home.css';

// function Home() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const routeDashboard = () => {
//         // Hardcoded user details for demonstration
//         const validEmail = 'user@example.com';
//         const validPassword = 'password123';

//         if (email === validEmail && password === validPassword) {
//             navigate('/dashboard');
//         } else {
//             alert('Invalid login credentials. Please try again.');
//         }
//     };

//     return (
//         <div className="home">
//             <h2>Welcome to Budget Tracker</h2>
//             <div className="form">
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//             </div>
//             <button className="login" onClick={routeDashboard}>
//                 <span className="login-button">Log In</span>
//             </button>
//         </div>
//     );
// }

// export default Home;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './home.css';

// function Home() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     // useNavigate essentially routes the page to the given path
//     // will need to add a user login details check
//     const routeDashboard = () => {
// 	navigate('/dashboard');
// 	navigate(0);
//     };
     
//     return (
// 	<div className="home">
// 	    <h2>Welcome to Budget Tracker</h2>
// 	    <div className="form">
// 		<input
// 		  type="email"
// 		  placeholder="Email"
// 		  value={email}
// 		  onChange={(e) => setEmail(e.target.value)}
// 		/>
// 		<input
// 		  type="password"
// 		  placeholder="Password"
// 		  value={password}
// 		  onChange={(e) => setPassword(e.target.value)}
// 		/>
// 	    </div>
// 	    <button className="login" onClick={routeDashboard}>
// 		<span className="login-button">Log In</span>
// 	    </button>
// 	</div>
//     );
// }

// export default Home;

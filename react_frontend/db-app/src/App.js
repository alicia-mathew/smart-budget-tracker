import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import './App.css';

const LogIn = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
        </Routes>
    );
};

const Main = () => {
    return (
	<Routes>
	    <Route path='/dashboard' element={<Dashboard />} />
	</Routes>
    );
};

function App() {
    return (
        <div className='App'>
            <Router>
                <LogIn />
            </Router>
	    <Router>
		<Main />
	    </Router>
        </div>
    );
}

export default App;

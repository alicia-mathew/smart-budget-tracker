import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import LogBudget from './pages/logbudgets';
import './App.css';

// all this needs edits

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

const Budget = () => {
    return (
	<Routes>
	    <Route path='/logbudgets' element={<LogBudget />} />
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
	    <Router>
		<Budget />
	    </Router>
        </div>
    );
}

export default App;

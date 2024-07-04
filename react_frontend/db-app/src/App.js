import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Expenses from './pages/expenses';
import LogBudget from './pages/logbudgets';
import Trends from './pages/trends';
import SmartSuggestions from './pages/smart_suggestions';
import Leaderboard from './pages/leaderboard';
import './App.css';

// all this needs edits

const LogIn = () => {
    return (
        <Routes>
            <Route path='/home' element={<Home />} />
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

const ExpenseList = () => {
    return (
	<Routes>
	    <Route path='/expenses' element={<Expenses />} />
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

const TrendsPage = () => {
    return (
	<Routes>
	    <Route path='/trends' element={<Trends />} />
	</Routes>
    );
};

const SmartSuggestionsPage = () => {
    return (
	<Routes>
	    <Route path='/smart_suggestions' element={<SmartSuggestions />} />
	</Routes>
    );
};

const LeaderboardPage = () => {
    return (
	<Routes>
	    <Route path='/savings_leaderboard' element={<Leaderboard />} />
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
			<ExpenseList />
	    </Router>
	    <Router>
			<Budget />
	    </Router>
	    <Router>
			<TrendsPage />
	    </Router>
		<Router>
			<SmartSuggestionsPage />
	    </Router>
		<Router>
			<LeaderboardPage />
	    </Router>
	</div>
    );
}

export default App;

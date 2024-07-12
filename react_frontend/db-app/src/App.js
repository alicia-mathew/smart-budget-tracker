import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Expenses from './pages/expenses';
import LogBudget from './pages/logbudgets';
import Trends from './pages/trends';
import SmartSuggestions from './pages/smart_suggestions';
import Leaderboard from './pages/leaderboard';
import Groups from './pages/groups';
import GroupPermissions from './pages/group_permissions';
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
	    <Route path='/expenses/:user_id' element={<Expenses />} />
	</Routes>
    );
};

const Budget = () => {
    return (
	<Routes>
	    <Route path='/logbudgets/:user_id' element={<LogBudget />} />
	</Routes>
    );
};

const TrendsPage = () => {
    return (
	<Routes>
	    <Route path='/trends/:user_id' element={<Trends />} />
	</Routes>
    );
};

const SmartSuggestionsPage = () => {
    return (
	<Routes>
	    <Route path='/smart_suggestions/:user_id' element={<SmartSuggestions />} />
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

const GroupsPage = () => {
    return (
	<Routes>
	    <Route path='/groups' element={<Groups />} />
	</Routes>
    );
};

const GroupPermissionsPage = () => {
    return (
	<Routes>
	    <Route path='/groups/manage_permissions/:group_id' element={<GroupPermissions />} />
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
		<Router>
			<GroupsPage />
	    </Router>
		<Router>
			<GroupPermissionsPage />
	    </Router>
	</div>
    );
}

export default App;

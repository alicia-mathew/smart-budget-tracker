import React from 'react';
import './dashboard.css';

function Dashboard() {
  return (
    <div className="Dashboard">
      <header className="header">
        <h1>Budget Tracker</h1>
        <button className="account-button">
          <span className="account-icon">⚪</span> Account
        </button>
      </header>
      <div className="content">
        <div className="section">
          <h2>Monthly</h2>
        </div>
        <div className="section">
          <h2>Yearly</h2>
        </div>
        <div className="section">
          <h2>Expenditure by Card</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

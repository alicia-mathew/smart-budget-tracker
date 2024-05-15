import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
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

export default App;

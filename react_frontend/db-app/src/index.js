import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root container for the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the root component of the React app, wrapped in StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Function to measure performance in your app
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

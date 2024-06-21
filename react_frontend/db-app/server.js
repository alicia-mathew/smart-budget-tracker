const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('milestone1.db');

// Endpoint to fetch expenses
app.get('/api/expenses', (req, res) => {
    const user_id = req.body;
    db.all('SELECT * FROM expenses WHERE user_id = ?', [user_id], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint to add a new expense
app.post('/api/expenses', (req, res) => {
    const { description, amount, category, date, user_id } = req.body;
    const stmt = db.prepare(`INSERT INTO expenses (expense_id, description, amount, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)`);

    const expense_id = `expense_${Date.now()}`; // Simple example using timestamp

    console.log("Adding new expense:", { expense_id, description, amount, category, date, user_id });

    stmt.run(expense_id, description, amount, category, date, user_id, function (err) {
        if (err) {
            console.error(err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            expense_id,
            description,
            amount,
            category,
            date,
            user_id
        });
    });
    stmt.finalize();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
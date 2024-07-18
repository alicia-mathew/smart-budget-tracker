import sqlite3
conn = sqlite3.connect("./flask_server/milestone1.db")
c = conn.cursor()

# Expense Management Add Record
c.execute("""INSERT INTO expenses (expense_id, amount, category, date, user_id, description) 
    VALUES (12987312, '20.38', 'Groceries', '2024-06-17', 1, 'No Frills')"""
)

# Expense Management Delete Record
c.execute("DELETE FROM expenses where expense_id = 5")

# Expense Management Edit Record
c.execute("""UPDATE expenses SET 
    amount = '20.38', 
    category = 'Groceries', 
    date = '2024-07-17', 
    user_id = '1', 
    description = 'NOT NO FRILLS!!!'
    WHERE expense_id = 5"""
)

# Expense Management List Records
result = c.execute("SELECT * FROM expense WHERE user_id=3 ORDER BY expense.date")
print(result.fetchall())

# Trends Expenditure vs Allotted Budget Monthly Comparison
result = c.execute("""SELECT e.category, SUM(e.amount), sg.amount 
                   FROM expenses e LEFT JOIN spending_goal sg ON e.category = sg.category AND e.user_id = sg.user_id 
                   WHERE e.user_id = 'I55555' GROUP BY e.category, sg.amount""")
print(result.fetchall())

# Trends Monthly Expenditure
result = c.execute("""SELECT substr(date, 4, 2) AS month, category, SUM(amount) AS total_amount 
                    FROM expenses WHERE user_id = 'I55555' GROUP BY month, category ORDER BY month""")
print(result.fetchall())

# smart suggestions
result = c.execute(
        """
        SELECT 
            sg.category as category, 
            sg.amount, 
            AVG(ex.amount) as avg_spending,
            sg_avg.amount as avg_budget
        FROM 
            spending_goal sg
            LEFT JOIN expenses ex ON ex.user_id = sg.user_id
                                    AND sg.category = ex.category
                                    AND ex.date >= DATE('now', '-3 months')
            LEFT JOIN (
                SELECT 
                    category, 
                    AVG(amount) AS amount
                FROM 
                    spending_goal
                GROUP BY 
                    category
            ) sg_avg ON sg.category = sg_avg.category
        WHERE 
            sg.user_id = ?
        GROUP BY sg.category
        """, 
        ("I33333",)
    )
print(result.fetchall())

# Savings Leaderboard
result = c.execute(
    """
    WITH 
    recent_expenses AS (
        SELECT 
            ex.user_id,
            SUM(ex.amount) AS total_expenses
        FROM 
            expenses ex
        WHERE 
            ex.date >= datetime('now', '-1 month')
        GROUP BY 
            ex.user_id
    ),
    total_spending_goals AS (
        SELECT 
            sg.user_id,
            SUM(sg.amount) AS total_goals
        FROM 
            spending_goal sg
        GROUP BY 
            sg.user_id
    ),
    relevant_individuals AS (
        SELECT DISTINCT
            gm.ind_id
        FROM
            group_member gm
        WHERE
            gm.group_id IN (
                SELECT 
                    gm.group_id
                FROM
                    group_member gm
                LEFT JOIN 
                    user ON gm.group_id = user.user_id
                WHERE
                    gm.ind_id = ?
            )
    )
    SELECT 
        u.name, 
        COALESCE(tg.total_goals, 0) - COALESCE(re.total_expenses, 0) AS net_savings
    FROM 
        relevant_individuals ri
        LEFT JOIN user u ON ri.ind_id = u.user_id
        LEFT JOIN recent_expenses re ON u.user_id = re.user_id
        LEFT JOIN total_spending_goals tg ON u.user_id = tg.user_id
    GROUP BY u.name
    ORDER BY net_savings DESC;
    """
)
print(result.fetchall())
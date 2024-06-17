import sqlite3
conn = sqlite3.connect("milestone1.db")
c = conn.cursor()

# Expense Management Add Record
c.execute("""INSERT INTO expenses (amount, category, date, user_id, description) 
    VALUES ('20.38', 'Groceries', '2024-06-17', 1, 'No Frills')"""
)

# Expense Management Delete Record
c.execute("DELETE FROM expenses where expense_id = 5")

# Expense Management Edit Record
c.execute("""UPDATE expenses SET 
    amount = '20.38', 
    category = 'Groceries', 
    date = '2024-07-17', 
    user_id = '1', 
    description = 'NOT NO FRILLS!!!"
    WHERE expense_id = 5"""
)

# Expense Management List Records
result = c.execute("SELECT * FROM expenses WHERE user_id=3")
print(result.fetchall())
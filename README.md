# Smart Budget Tracker Application

*(University of Waterloo | CS 338 Spring 2024 | Final Project)*

**Application Overview**
Our final project is a personal budgeting application designed to help users effectively manage their finances. Key features of the application include a budget logger, expense management tools, spending pattern visualizations, and smart spending optimization suggestions. Additionally, the application supports a group enrollment feature, allowing users to track shared expenses conveniently. The primary users of this app are individuals and groups, such as families, students, and roommates, who seek a robust platform for managing personal or collective financial activities. To demonstrate the functionality of the app, we will create a production dataset as the principal administrators and developers.

**System Support**
The application is hosted locally and accessed through a web interface, to provide a desktop-based user-friendly experience rather than mobile use. Our technology stack consists of Flask and React for dynamic web development, with HTML, CSS, and JavaScript enhancing the front end. For database management, we utilize SQLite3, ensuring scalable user data handling.

**Main Features**:
1. Budget Goal Management: Sheet where users can view, add, edit, and delete their monthly budget goals for any category they want.
2. Expense Management: Sheet where users can view, add, edit, delete, search, and filter through all their expenses for any category they have previously logged a budget goal for.
3. Visualize Spending Patterns: A tool that analyzes spending and saving patterns, displaying insights on when users tend to overspend or underspend, helping them understand their financial habits. Uses line charts and a radial plot to compare actual spending against set goals, assisting users to visualize their financial activity.
4. Smart Suggestions: A tool that displays smart suggestions to the user on how to spend and save more efficiently to meet their previously logged budget goals (or how to modify them to their current spending).
5. Savings Leaderboard: 
6. Group Management: A feature that allows users to join group accounts to create, and manage a collective budget as well as functionality to control/manage which group members have access to certain permissions like adding/deleting/editing data from the budget goals or expense management sheets.

**Database Info**
<br />
Our database is created with SQLite3 as written in `production_db_generation.py`. To create the database, run:
`python3 production_db_generation.py`
This will create a .db file in the local directory containing our sample dataset.

Once created, we can load the .db file using SQLite3 in Python:
```
# connect to the database
import sqlite3
conn = sqlite3.connect("your_db.db")

# fetch rows from a table
c = conn.cursor()
c.execute("""SELECT * FROM expenses""")
result = c.fetchall()
print(result)
```

Sample queries for the application features can be found in `sample_queries.py`, and the query outputs in `sample_outputs.txt`

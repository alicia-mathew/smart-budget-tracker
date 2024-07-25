# Smart Budget Tracker Application

_**(University of Waterloo | CS 338 Spring 2024 | Final Project)**_

**Description of app**: We are building a personal budgeting application that assists people in managing personal finances. Some of the app's features include an expense overview page where users can select a daily or monthly view, groups where users can enroll to track shared expenses together, recommendations on optimizing their spending, and recurring payment tracking to help users plan their monthly expenditures. The main users of the app are individuals and groups of individuals (families, students,  adults, etc.) who want to track their personal/group expenses. The dataset will be created by us, catering to the unique features provided in the application. The administrators of the database are the developers of the application.

**Description of Platform**: Our application will run on a local machine, enabling users to interact with a locally hosted web application. The app is designed to be primarily desktop-based, rather than mobile-based, providing a more comprehensive user experience. Our technology stack includes React, Flask, HTML, CSS, and JavaScript, with SQLite3 for our database. The live app will be hosted on a webpage instead of a command-line interface. 

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

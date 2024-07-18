import sqlite3
import random
import os
from datetime import datetime, timedelta


# Remove the existing database file if needed (ensure no other process is using it)
if os.path.exists("production.db"):
    os.remove("production.db")

conn = sqlite3.connect("production.db")
c = conn.cursor()


# Creating Database
c.execute("""CREATE TABLE user (
          user_id INT NOT NULL PRIMARY KEY,
          name TEXT NOT NULL)
          """)

c.execute(""" CREATE TABLE individual (
          ind_id INT NOT NULL PRIMARY KEY,
          income REAL CHECK (income > 0),
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          FOREIGN KEY (ind_id) REFERENCES user (user_id))
          """)

c.execute(""" CREATE TABLE groups (
          group_id INT NOT NULL PRIMARY KEY,
          group_income REAL CHECK (group_income > 0),
          FOREIGN KEY (group_id) REFERENCES user (user_id))
          """)

c.execute(""" CREATE TABLE role (
          role_id INT NOT NULL PRIMARY KEY,
          create_sg INTEGER NOT NULL CHECK (create_sg IN (0,1)),  -- Boolean attribute represented as INTEGER
          modify_exp INTEGER NOT NULL CHECK (modify_exp IN (0,1)),  -- Boolean attribute represented as INTEGER
          manage_mem INTEGER NOT NULL CHECK (manage_mem IN (0,1)),  -- Boolean attribute represented as INTEGER
          add_exp INTEGER NOT NULL CHECK (add_exp IN (0,1)),  -- Boolean attribute represented as INTEGER
          FOREIGN KEY (role_id) REFERENCES group_member (role_id))
          """)

c.execute(""" CREATE TABLE group_member (
          mem_id INT NOT NULL PRIMARY KEY,
          group_id INT NOT NULL,
          role_id INT NOT NULL,
          ind_id INT NOT NULL,
          FOREIGN KEY (group_id) REFERENCES groups (group_id),
          FOREIGN KEY (ind_id) REFERENCES individual (ind_id))
          """)

c.execute(""" CREATE TABLE expenses (
          expense_id INT NOT NULL PRIMARY KEY,
          amount REAL CHECK (amount > 0),
          category TEXT NOT NULL,
          date TEXT NOT NULL, -- Date attribute in text format YYYY-DD-MM
          user_id INT NOT NULL,
          description TEXT,
          FOREIGN KEY (user_id) REFERENCES user (user_id))
          """)

c.execute(""" CREATE TABLE spending_goal (
          spending_id INT NOT NULL PRIMARY KEY,
          amount REAL CHECK (amount > 0),
          category TEXT NOT NULL,
          user_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES user (user_id),
          UNIQUE (category, user_id))
          """)

# Populating Database
names = ['Aminah', 'Govind', 'Evan', 'Dhruv', 'Aly', 'Group 3', 'Group 1']
ids = [11, 12, 13, 14, 15, 21, 22]
incomes = [250, 689, 8569.50, 7962.32, 45100]
emails = ['aminah@gmail.com', 'govind@gmail.com', 'evan@gmail.com', 'dhurv@gmail.com', 'aly@gmail.com']
passwords = ['dg3gDes', '3ioXi32', 'eio9DJ', '3djIDw', 'd2figS']
mem_ids = [1, 2, 3, 4, 5, 6, 7]
rol_ids = [1, 2, 3, 4, 5, 6, 7]
createSG =[1, 1, 1, 0, 0, 1, 0]
modifyExp = [1, 1, 0, 0, 0, 1, 1]
manageMem = [1, 1, 1, 1, 1, 1, 1]
addExp = [1, 1, 1, 1, 0, 1, 0]
exp_ids = [1, 2, 3]
# Categories and descriptions
categories = {
    'Food': [
        'Dinner at a restaurant',
        'Breakfast at a cafe',
        'Lunch at a fast-food restaurant',
        'Snacks from a vending machine',
        'Takeout dinner',
        'Coffee and pastries'
    ],
    'Entertainment': [
        'Movie tickets',
        'Concert tickets',
        'Streaming service subscription',
        'Bowling night',
        'Museum entrance fee',
        'Amusement park tickets'
    ],
    'Grocery': [
        'Weekly grocery shopping',
        'Fresh produce shopping',
        'Dairy products purchase',
        'Meat and poultry shopping',
        'Buying frozen foods',
        'Pantry staples restock'
    ],
    'Travel': [
        'Taxi fare',
        'Bus fare',
        'Train tickets',
        'Flight tickets',
        'Hotel booking',
        'Car rental fee'
    ],
    'Utilities': [
        'Electricity bill',
        'Water bill',
        'Gas bill',
        'Internet service bill',
        'Trash collection fee',
        'Phone bill'
    ],
    'Pet': [
        'Pet food',
        'Veterinary visit',
        'Pet grooming',
        'Pet toys',
        'Pet accessories',
        'Pet medications'
    ],
    'Insurance': [
        'Health insurance premium',
        'Car insurance premium',
        'Home insurance premium',
        'Life insurance premium',
        'Dental insurance premium',
        'Travel insurance premium'
    ],
    'Leisure': [
        'Gym membership',
        'Yoga class',
        'Spa treatment',
        'Fitness equipment purchase',
        'Art supplies',
        'Sports club membership'
    ],
    'Rent': [
        'Monthly rent payment',
        'Security deposit',
        'Late rent fee',
        'Parking space rent',
        'Storage unit rent',
        'Garage rent'
    ],
    'Kids': [
        'School supplies',
        'Childcare services',
        'Toys purchase',
        'Children\'s clothing',
        'School tuition fee',
        'After-school program fee'
    ]
}

spending_goal_amounts = {
    'Food': 50,
    'Entertainment': 20,
    'Grocery': 100,
    'Travel': 60,
    'Utilities': 20,
    'Pet': 150,
    'Insurance': 100,
    'Leisure': 100,
    'Rent': 70,
    'Kids': 10
}

spending_goal_group = {
    'Food': 500,
    'Entertainment': 300,
    'Grocery': 400,
    'Travel': 600,
    'Utilities': 200,
    'Pet': 150,
    'Insurance': 250,
    'Leisure': 100,
    'Rent': 800,
    'Kids': 400
}

for i in range(7):
    c.execute(f""" INSERT INTO user (user_id, name)
              VALUES ('{ids[i]}', '{names[i]}')
              """)

for i in range(5):
    c.execute(f""" INSERT INTO individual (ind_id, income, email, password)
              VALUES ('{ids[i]}', {incomes[i]}, '{emails[i]}', '{passwords[i]}')
              """)

c.execute(f""" INSERT INTO groups (group_id, group_income)
          VALUES ('{ids[5]}', 10000)
          """)

c.execute(f""" INSERT INTO groups (group_id, group_income)
          VALUES ('{ids[6]}', 15500)
          """)


for i in range(5):
    c.execute(f""" INSERT INTO group_member (mem_id, group_id, role_id, ind_id)
              VALUES ('{mem_ids[i]}', '{ids[5]}', '{rol_ids[i]}', '{ids[i]}')
              """)
for i in range(2):
    c.execute(f""" INSERT INTO group_member (mem_id, group_id, role_id, ind_id)
              VALUES ('{mem_ids[i+5]}', '{ids[6]}', '{rol_ids[i+5]}', '{ids[i]}')
              """)

for i in range(5):
    c.execute(f""" INSERT INTO role (role_id, create_sg, modify_exp, manage_mem, add_exp)
              VALUES ('{rol_ids[i]}', {createSG[i]}, {modifyExp[i]}, {manageMem[i]}, {addExp[i]})
              """)

start_date = datetime.now()
expense_id = 1
for category, descriptions in categories.items():
    for description in descriptions:
        expense_date = start_date + timedelta(days=random.randint(0, 90))
        expense_date = expense_date.strftime('%Y-%m-%d')
        amount = round(random.uniform(10, 50), 2)
        c.execute("""
        INSERT INTO expenses (expense_id, amount, category, date, user_id, description)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (expense_id, amount, category, expense_date, 12, description))
        expense_id += 1

#Running it again for group 21
start_date = datetime.now()
expense_id += 1
for category, descriptions in categories.items():
    for description in descriptions:
        user_id = random.choice([21, 22])
        expense_date = start_date + timedelta(days=random.randint(0, 90))
        expense_date = expense_date.strftime('%Y-%m-%d')
        amount = round(random.uniform(10, 200), 2)
        c.execute("""
        INSERT INTO expenses (expense_id, amount, category, date, user_id, description)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (expense_id, amount, category, expense_date, 21, description))
        expense_id += 1

#Running it again for group 22
start_date = datetime.now()
expense_id += 1
for category, descriptions in categories.items():
    for description in descriptions:
        user_id = random.choice([21, 22])
        expense_date = start_date + timedelta(days=random.randint(0, 90))
        expense_date = expense_date.strftime('%Y-%m-%d')
        amount = round(random.uniform(10, 200), 2)
        c.execute("""
        INSERT INTO expenses (expense_id, amount, category, date, user_id, description)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (expense_id, amount, category, expense_date, 22, description))
        expense_id += 1
#Spending goal for each individual
spending_goal_id = 1
for category, amount in spending_goal_amounts.items():
    c.execute("""
    INSERT INTO spending_goal (spending_id, amount, category, user_id)
    VALUES (?, ?, ?, ?)
    """, (spending_goal_id, amount, category, 12))
    spending_goal_id += 1

#Spending goal for group 21
spending_goal_id += 1
for category, amount in spending_goal_group.items():
    c.execute("""
    INSERT INTO spending_goal (spending_id, amount, category, user_id)
    VALUES (?, ?, ?, ?)
    """, (spending_goal_id, amount, category, 21))
    spending_goal_id += 1

#Spending goal for group 22
spending_goal_id += 1
for category, amount in spending_goal_group.items():
    c.execute("""
    INSERT INTO spending_goal (spending_id, amount, category, user_id)
    VALUES (?, ?, ?, ?)
    """, (spending_goal_id, amount, category, 22))
    spending_goal_id += 1

# create 3 expeses for remaining users to populate leaderboard
for user_id in ids:
    if user_id == 12:
        continue
    # create personal spending goal
    c.execute("""
        INSERT INTO spending_goal (spending_id, amount, category, user_id)
        VALUES (?, ?, ?, ?)
        """, (spending_goal_id, 1000, "Personal", user_id))

    # create 3 expenses
    for i in range(3):
        c.execute("""
            INSERT INTO expenses (expense_id, amount, category, date, user_id, description)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (expense_id, random.randint(1, 200), "Personal", expense_date, user_id, description))
        expense_id += 1

    spending_goal_id += 1

    


def print_table_contents(table_name):
    c.execute(f"SELECT * FROM {table_name}")
    rows = c.fetchall()
    print(f"\nContents of table '{table_name}':")
    for row in rows:
        print(row)

# List of all tables to view
tables = ["user", "individual", "groups", "role", "group_member", "expenses", "spending_goal"]
for table in tables:
    print_table_contents(table)
    pass

conn.commit()
conn.close()
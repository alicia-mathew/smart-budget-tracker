import sqlite3
import os

os.remove("milestone1.db")
conn = sqlite3.connect("milestone1.db")

c = conn.cursor()

# Creating DataBase
c.execute("""CREATE TABLE user (
          user_id INT NOT NULL PRIMARY KEY,
          name TEXT NOT NULL)
          """)

c.execute(""" CREATE TABLE individual (
          ind_id TEXT NOT NULL PRIMARY KEY,
          income REAL,
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          FOREIGN KEY (ind_id) REFERENCES user (user_id))
          """)

c.execute(""" CREATE TABLE groups (
          group_id TEXT NOT NULL PRIMARY KEY,
          created_date TEXT NOT NULL, -- Date attribute in text format DD-MM-YY
          group_income REAL,
          FOREIGN KEY (group_id) REFERENCES user (user_id))
          """)

c.execute(""" CREATE TABLE role (
          role_id TEXT NOT NULL PRIMARY KEY,
          create_sg INTEGER NOT NULL,  -- Boolean attribute represented as INTEGER
          modify_exp INTEGER NOT NULL,  -- Boolean attribute represented as INTEGER
          Manage_mem INTEGER NOT NULL,  -- Boolean attribute represented as INTEGER
          add_exp INTEGER NOT NULL,  -- Boolean attribute represented as INTEGER
          FOREIGN KEY (role_id) REFERENCES group_member (role_id))
          """)

c.execute(""" CREATE TABLE group_member (
          mem_id TEXT NOT NULL PRIMARY KEY,
          group_id TEXT NOT NULL,
          role_id TEXT NOT NULL,
          ind_id TEXT NOT NULL,
          FOREIGN KEY (group_id) REFERENCES groups (group_id),
          FOREIGN KEY (role_id) REFERENCES role (role_id),
          FOREIGN KEY (ind_id) REFERENCES individual (ind_id))
          """)

c.execute(""" CREATE TABLE expenses (
          expense_id TEXT NOT NULL PRIMARY KEY,
          amount REAL,
          category TEXT NOT NULL,
          date TEXT NOT NULL, -- Date attribute in text format DD-MM-YY
          user_id INT NOT NULL,
          description TEXT,
          FOREIGN KEY (user_id) REFERENCES user (user_id))
          """)


c.execute(""" CREATE TABLE spending_goal (
          spending_id TEXT NOT NULL PRIMARY KEY,
          amount REAL,
          category TEXT NOT NULL,
          date_created TEXT NOT NULL, -- Date attribute in text format DD-MM-YY
          user_id TEXT NOT NULL,
          end_date TEXT NOT NULL, -- Date attribute in text format DD-MM-YY,
          start_date TEXT NOT NULL, -- Date attribute in text format DD-MM-YY
          FOREIGN KEY (user_id) REFERENCES user (user_id))
          """)


c.execute(""" CREATE TABLE frequent_expense (
          freq_exp_id TEXT NOT NULL PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount REAL,
          category TEXT NOT NULL,
          description TEXT,
          FOREIGN KEY (user_id) REFERENCES individual (user_id))
          """)
        
# Populating DataBase
names = ['Aminah', 'Govind', 'Evan', 'Dhruv', 'Aly', 'Group3']
ids = [1, 2, 3, 4, 5, 6]
incomes = [250, 689, 8569.50, 7962.32, 45100]
emails = ['aminah@gmail.com', 'govind@gmail.com', 'evan@gmail.com', 'dhurv@gmail.com', 'aly@gmail.com']
passwords = ['dg3gDes', '3ioXi32', 'eio9DJ', '3djIDw', 'd2figS']
mem_ids = ['member1', 'member2', 'member3', 'member4', 'member5']
rol_ids = ['role1', 'role2', 'role3', 'role4', 'role5']
createSG =[1, 1, 1, 0, 0]
modifyExp = [1, 1, 0, 0, 0]
manageMem = [1, 0, 1, 0, 0]
addExp = [1, 1, 1, 1, 0]
exp_ids = ['Exp1', 'Exp2', 'Exp3']
cat = ['Food', 'Enterainment', 'Food']
dates = ['12-06-23', '30-04-24', '01-02-24']
desc = ['ate at McD', '', 'milk']

for i in range(6):
    c.execute(f""" INSERT INTO user (user_id, name)
              VALUES ('{ids[i]}', '{names[i]}')
              """)

for i in range(5):
    c.execute(f""" INSERT INTO individual (ind_id, income, email, password)
              VALUES ('{ids[i]}', {incomes[i]}, '{emails[i]}', '{passwords[i]}')
              """)

c.execute(f""" INSERT INTO groups (group_id, created_date, group_income)
          VALUES ('{ids[5]}', '13-06-24', 10000)
          """)

for i in range(5):
    c.execute(f""" INSERT INTO group_member (mem_id, group_id, role_id, ind_id)
              VALUES ('{mem_ids[i]}', '{ids[5]}', '{rol_ids[i]}', '{ids[i]}')
              """)

for i in range(5):
    c.execute(f""" INSERT INTO role (role_id, create_sg, modify_exp, manage_mem, add_exp)
              VALUES ('{rol_ids[i]}', {createSG[i]}, {modifyExp[i]}, {manageMem[i]}, {addExp[i]})
              """)

#if its a foreign currency, the amount displayed should be amount*exchange_rate, it might make sense to add fields to expense and get rid of foreign_currency
for i in range(3):
    c.execute(f""" INSERT INTO expenses (expense_id, amount, category, date, user_id, description)
              VALUES ('{exp_ids[i]}', {10+i}, '{cat[i]}', '{dates[i]}', {ids[i+2]}, '{desc[i]}')
              """)

c.execute(f""" INSERT INTO spending_goal (spending_id, amount, category, date_created, user_id, end_date, start_date)
          VALUES ('SG1', 500, 'Food', '13-06-24', '{ids[0]}', '30-06-24', '01-06-24')
          """)

c.execute(f""" INSERT INTO spending_goal (spending_id, amount, category, date_created, user_id, end_date, start_date)
          VALUES ('SG2', 300, 'Entertainment', '13-05-24', '{ids[1]}', '30-06-24', '01-06-24')
          """)

c.execute(f""" INSERT INTO spending_goal (spending_id, amount, category, date_created, user_id, end_date, start_date)
          VALUES ('SG3', 25, 'Food', '13-05-24', '{ids[5]}', '30-06-24', '01-06-24')
          """)

c.execute(f""" INSERT INTO frequent_expense (freq_exp_id, user_id, amount, category, description)
          VALUES ('FE1', '{ids[1]}', 5, 'Food', 'Milk')
          """)

conn.commit()
conn.close()
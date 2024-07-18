from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__, static_folder='../react_frontend/db-app/build')
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Enable CORS for all routes


# Helper to add a month to time
def add_months(current_date, months_to_add):
    new_date = datetime(current_date.year + (current_date.month + months_to_add - 1) // 12,
                        (current_date.month + months_to_add - 1) % 12 + 1,
                        current_date.day, current_date.hour, current_date.minute, current_date.second)
    return new_date


# Helper to return formatted monthly data
def process_expense_data(results):
    month_mapping = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    }

    monthly_data = {}

    for month, category, sum_amount in results:
        month_name = month_mapping[month]
        if month_name not in monthly_data:
            monthly_data[month_name] = {}
        monthly_data[month_name][category] = sum_amount

    return monthly_data


# Function to connect to the database
def get_db_connection():
    conn = sqlite3.connect('production.db')
    conn.row_factory = sqlite3.Row
    return conn


# function to get new id
def get_next_id(table_name, pk):
    conn = get_db_connection()
    next_id = conn.execute(f"""SELECT MAX({pk}) FROM {table_name}""").fetchone()
    next_id = dict(next_id)[f"MAX({pk})"] + 1
    print("NEXT ID", table_name, pk, next_id)
    return next_id


# Additional function to get database cursor
def get_db_conn_and_cursor():
    conn = sqlite3.connect('production.db')
    return conn, conn.cursor()


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


# API endpoint to fetch all users
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM user').fetchall()
    conn.close()
    users_list = [dict(user) for user in users]
    return jsonify(users_list)


# API endpoint to add a new user
@app.route('/api/users', methods=['POST'])
def add_user():
    new_user = request.get_json()
    user_id = new_user['user_id']
    name = new_user['name']

    conn = get_db_connection()
    conn.execute('INSERT INTO user (user_id, name) VALUES (?, ?)', (user_id, name))
    conn.commit()
    conn.close()
    return jsonify(new_user), 201


@app.route('/api/categories', methods=['GET'])
def get_categories():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    categories = conn.execute('SELECT category FROM spending_goal WHERE user_id = ?', (user_id, )).fetchall()
    conn.close()
    return jsonify([cat[0] for cat in categories])


@app.route('/api/category', methods=['POST'])
def add_categories():
    data = request.get_json()
    user_id = data['user_id']
    spending_id = get_next_id("spending_goal", "spending_id")
    category = data['category']
    amount = data['value']

    conn = get_db_connection()
    conn.execute('INSERT INTO spending_goal VALUES (?, ?, ?, ?)',
                 (spending_id, amount, category, user_id))
    conn.commit()
    conn.close()
    return jsonify(data), 201


@app.route('/api/category', methods=['PUT'])
def update_budgets():
    data = request.get_json()
    spending_id = data['budget_id']
    category = data['category']
    amount = data['value']
    conn = get_db_connection()
    conn.execute('UPDATE spending_goal SET category = ?, amount = ? WHERE spending_id = ?', (category, amount, spending_id))
    conn.commit()
    conn.close()
    return jsonify({'state': 'success', 'spending_id': spending_id})


@app.route('/api/category', methods=['DELETE'])
def delete_budget():
    spending_id = request.args.get('spending_id')
    conn = get_db_connection()
    conn.execute('DELETE FROM spending_goal WHERE spending_id = ?', (spending_id, ))
    conn.commit()
    conn.close()
    return jsonify({'state': 'success', 'spending_id': spending_id})


@app.route('/api/budget', methods=['GET'])
def get_budgets():
    user_id = request.args.get('user_id')
    print(user_id)
    conn = get_db_connection()
    budgets = conn.execute('SELECT spending_id, category, amount FROM spending_goal WHERE user_id = ?',
                           (user_id, )).fetchall()
    conn.close()
    budget_list = [dict(budget) for budget in list(budgets)]
    return jsonify(budget_list)


@app.route('/api/trends', methods=['GET'])
def get_comp_data():
    user_id = request.args.get('user_id')
    print(user_id)
    conn = get_db_connection()
    data = conn.execute('SELECT sum(amount), category FROM expenses WHERE user_id = ? GROUP BY 2', (user_id,))
    data_dict = [dict(cat) for cat in data]
    conn.close()
    return jsonify(data_dict)


@app.route('/api/radartrends', methods=['GET'])
def get_radar_data():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    data = conn.execute('SELECT SUBSTRING(date, 6, 2) AS month, category, SUM(amount) AS sum FROM expenses WHERE user_id = ? GROUP BY 1, 2', (user_id,)).fetchall()
    monthly_data = process_expense_data(data)
    formatted_data = [{"Month": month, **categories} for month, categories in monthly_data.items()]
    return jsonify(formatted_data)


# API endpoint to fetch all expenses
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    expenses = conn.execute('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', (user_id,)).fetchall()
    conn.close()
    expenses_list = [dict(expense) for expense in expenses]
    return jsonify(expenses_list)


# API endpoint to add a new expense
@app.route('/api/expenses', methods=['POST'])
def add_expense():
    new_expense = request.get_json()
    # expense_id = new_expense['expense_id']
    expense_id = get_next_id("expenses", "expense_id")
    amount = new_expense['amount']
    category = new_expense['category']
    date_format = '%Y-%m-%d'
    date = datetime.strptime(new_expense['date'], date_format).date()
    user_id = new_expense['user_id']
    description = new_expense['description']

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO expenses (expense_id, amount, category, date, user_id, description) VALUES (?, ?, ?, ?, ?, ?)',
        (expense_id, amount, category, date, user_id, description)
    )
    conn.commit()
    conn.close()
    return jsonify(new_expense), 201


# API endpoint to delete an expense
@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM expenses WHERE expense_id = ?', (expense_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success', 'expense_id': expense_id})


# API endpoint to update an expense
@app.route('/api/expenses/<expense_id>', methods=['PUT'])
def update_expense(expense_id):
    data = request.get_json()
    description = data.get('description')
    amount = data.get('amount')
    category = data.get('category')
    date = data.get('date')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE expenses SET description = ?, amount = ?, category = ?, date = ? WHERE expense_id = ?',
                   (description, amount, category, date, expense_id))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success', 'expense_id': expense_id})


# API endpoint for user authentication
@app.route('/api/auth', methods=['POST'])
def authenticate_user():
    login_data = request.get_json()
    email = login_data['email']
    password = login_data['password']

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM individual WHERE email = ? AND password = ?', (email, password)).fetchone()
    conn.close()

    if user:
        user_dict = dict(user)
        return jsonify({"status": "success", "user": user_dict}), 200
    else:
        return jsonify({"status": "fail", "message": "Invalid credentials"}), 401


@app.route('/api/username', methods=['GET'])
def get_username():
    ind_id = request.args.get('user_id')
    conn = get_db_connection()
    user = conn.execute('SELECT name FROM user WHERE user_id = ?', (ind_id, )).fetchone()
    conn.close()
    return jsonify(dict(user)['name'])


# API endpoint for smart suggestions
@app.route('/api/smart_suggestions', methods=['GET'])
def generate_smart_suggestions():
    user_id = request.args.get('user_id')
    conn = get_db_connection()

    # for each category for the user, fetch
    # 1. the category name
    # 2. amount budgeted to that category
    # 3. average amount spent for that category in last three months by the user
    # 4. average amount budgeted for that category across all users
    spending_data = conn.execute(
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
        (user_id,)
    ).fetchall()

    result = [dict(category) for category in spending_data]
    suggestions = []
    for category in result:
        category_name, budget = category["category"], category["amount"]
        user_spending, avg_budgeted = category["avg_spending"], category["avg_budget"]
        # check if there are categories with significant over/under spending
        if user_spending is not None:
            spend_ratio = user_spending/budget
            if spend_ratio > 1.3:
                suggestions.append({"category": category_name, "text": f"Increase your budget for this category since you spend {spend_ratio*100:.2f}% of this budget on average"})
            elif spend_ratio < 0.7:
                suggestions.append({"category": category_name, "text": f"Decrease your budget for this category since you only spend {spend_ratio*100:.2f}% of this budget on average"})
        
        # check if there are categories with significant over budgeting relative to other users
        budget_ratio = budget/avg_budgeted
        if budget_ratio > 2:
            suggestions.append({"category": category_name, "text": f"Decrease your budget for this category since you budget {budget_ratio:.2f} times more for this type of expense than the average user."})
    
    return jsonify(suggestions)


# API endpoint for fetching leaderboard
@app.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    conn = get_db_connection()
    leaderboard = conn.execute(
        """
        SELECT
            user.name,
            SUM(sg.amount) - SUM(ex.amount) as net_savings
        FROM
            user
            LEFT JOIN expenses ex on ex.user_id = user.user_id
            LEFT JOIN spending_goal sg on sg.user_id = user.user_id
        GROUP BY user.name
        HAVING net_savings is not null
        ORDER BY net_savings DESC
        """
    ).fetchall()

    return jsonify([dict(category) for category in leaderboard])


# API endpoint for fetching user groups
@app.route('/api/user_groups', methods=['GET'])
def get_user_groups():
    user_id = request.args.get('user_id')
    conn = get_db_connection()

    response = conn.execute(
        """
        SELECT
            gm.group_id,
            user.name
        FROM
            group_member gm
            LEFT JOIN user on gm.group_id = user.user_id
        WHERE
            ind_id = ?
        """,
        (user_id,)
    ).fetchall()

    groups = [dict(group) for group in response]
    return jsonify(groups)


# API endpoint for creating a new group
@app.route('/api/create_group', methods=['POST'])
def create_group():
    data = request.get_json()
    user_id = data['user_id']
    group_name = data['group_name']
    conn, cursor = get_db_conn_and_cursor()
    # create the group
    # insert into users
    group_id, role_id, mem_id = get_next_id("groups", "group_id"), get_next_id("role", "role_id"), get_next_id("group_member", "mem_id")
    cursor.execute(
        """
        INSERT INTO user (user_id, name) VALUES (?, ?)
        """,
        (group_id, group_name)
    )

    # insert into groups
    cursor.execute(
        """
        INSERT INTO groups (group_id) VALUES (?)
        """,
        (group_id,)
    )

    # add the creator as an "admin" user
    # create a role
    cursor.execute(
        """
        INSERT INTO role (role_id, create_sg, modify_exp, manage_mem, add_exp) VALUES (?, 1, 1, 1, 1)
        """,
        (role_id,)
    )

    # create a group member
    cursor.execute(
        """
        INSERT INTO group_member (mem_id, group_id, role_id, ind_id) VALUES (?, ?, ?, ?)
        """,
        (mem_id, group_id, role_id, user_id)
    )

    # commit changes
    conn.commit()
    return {"group_id": group_id, "name": group_name}


# API endpoint for adding a user to a group
@app.route('/api/join_group', methods=['POST'])
def join_group():
    data = request.get_json()
    user_id = data['user_id']
    group_id = data['group_id']
    conn, cursor = get_db_conn_and_cursor()
    role_id, mem_id = get_next_id("role", "role_id"), get_next_id("group_member", "mem_id")

    # add the user with no permissions by default
    # create a role
    cursor.execute(
        """
        INSERT INTO role (role_id, create_sg, modify_exp, manage_mem, add_exp) VALUES (?, 0, 0, 0, 0)
        """,
        (role_id,)
    )

    # create a group member
    cursor.execute(
        """
        INSERT INTO group_member (mem_id, group_id, role_id, ind_id) VALUES (?, ?, ?, ?)
        """,
        (mem_id, group_id, role_id, user_id)
    )

    # commit changes
    conn.commit()

    group_name = cursor.execute(""" SELECT name FROM user WHERE user.user_id = ?""", (group_id,)).fetchone()
    return {"group_id": group_id, "name": group_name}


# API endpoint to get permissions for all members in a group
@app.route('/api/get_group_permissions', methods=['GET'])
def get_group_permissions():
    group_id = request.args.get('group_id')
    conn = get_db_connection()

    permissions = conn.execute(
        """
        SELECT
            user.name,
            role.create_sg,
            role.modify_exp,
            role.manage_mem,
            role.add_exp,
            role.role_id
        FROM
            groups
            LEFT JOIN group_member gm on groups.group_id = gm.group_id
            LEFT JOIN role on gm.role_id = role.role_id
            LEFT JOIN user on user.user_id = gm.ind_id
        WHERE
            groups.group_id = ?
        """,
        (group_id,)
    ).fetchall()

    return jsonify([dict(permission) for permission in permissions])

# API endpoint for modifying permissions of a user in a group
@app.route('/api/modify_group_permissions', methods=['POST'])
def modify_group():
    conn, cursor = get_db_conn_and_cursor()
    data = request.get_json()

    for user in data:
        cursor.execute(
            """
            UPDATE
                role
            SET
                create_sg = ?,
                modify_exp = ?,
                manage_mem = ?,
                add_exp = ?
            WHERE
                role_id = ?
            """,
            (user["create_sg"], user["modify_exp"], user["manage_mem"], user["add_exp"], user["role_id"])
        )
    conn.commit()

    return "Successfully modified permissions"


# API endpoint for checking if the user has permission to manage group permissions
@app.route('/api/can_modify_group_permissions', methods=['POST'])
def can_modify_group():
    data = request.get_json()
    user_id = data['user_id']
    group_id = data['group_id']
    conn = get_db_connection()

    is_admin = conn.execute(
        """
        SELECT
            role.manage_mem
        FROM
            role
            LEFT JOIN group_member gm on gm.role_id = role.role_id
        WHERE
            gm.ind_id = ?
            AND gm.group_id = ?
        """,
        (user_id, group_id)
    ).fetchone()
    return dict(is_admin)


if __name__ == '__main__':
    app.run(debug=True)

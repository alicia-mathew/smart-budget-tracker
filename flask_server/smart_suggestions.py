import pandas as pd
import numpy as np
import random
import string

random.seed('0507')

# Function to generate a random email
def generate_email():
    domains = ["example.com", "test.com", "sample.com"]
    return ''.join(random.choices(string.ascii_lowercase, k=5)) + "@" + random.choice(domains)

# Function to generate a random password
def generate_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choices(characters, k=length))

# Generate data for Users DataFrame
user_id = random.randint(10000, 99999)
users_data = {
    "user_id": [user_id],
    "username": [generate_email()],
    "password": [generate_password()],
    "first_name": ["John"],
    "last_name": ["Doe"]
}
users_df = pd.DataFrame(users_data)

# Generate data for Categories DataFrame
categories_data = {
    "category_id": [random.randint(100, 999) for _ in range(3)],
    "category_name": ["Rent", "Groceries", "Shopping"],
    "user_id": [user_id] * 3,
    "category_budget": [800, 300, 400]
}
categories_df = pd.DataFrame(categories_data)

# Find the category_id for "Groceries"
groceries_category_id = categories_df.loc[categories_df['category_name'] == 'Groceries', 'category_id'].values[0]

# Generate data for Expenses DataFrame
expenses_data = {
    "expense_id": [random.randint(1000, 9999) for _ in range(2)],
    "expense_name": ["Walmart", "Sobey's"],
    "category_id": [groceries_category_id] * 2,
    "user_id": [user_id] * 2,
    "expense_value": [200, 50]
}
expenses_df = pd.DataFrame(expenses_data)

def smart_suggestions(user_id):
    # transform data
    user_budgets = categories_df[categories_df.user_id == user_id]
    user_expenses = expenses_df[expenses_df.user_id == user_id]

    # check if there are categories for which the user over/under spends
    recommendations = []
    for category_name in user_budgets.category_name:
        budget = user_budgets[user_budgets.category_name == category_name]
        category_id, category_amount = budget.category_id, budget.category_amount
        expense_amount = sum(user_expenses[user_expenses.category_id == category_id].expense_value)
        expense_budget_ratio = expense_amount/category_amount
        if expense_budget_ratio < 0.7:
            recommendations.append(f"Reduce budget for {category_name}")
        elif expense_budget_ratio > 1.3:
            recommendations.append(f"Increase budget for {category_name}")
    
    # check if there are categories where the user budgets way more than the average user
    # TBD when we have a real query. Something like:
    # SELECT category_name, 
    # SUM(expense_amount where user_id = user_id and within last three months and category = category_name)/3 as user_avg
    # COUNT(user_id where category = category_names) as num_user_with_category
    # SUM(expense_amount where category = category_name and within last three months)/num_user_with_category as platform_avg
    # FROM categories left join expenses on category_id
    # WHERE categories.category = category_name




# Display DataFrames
# print("Users DataFrame:")
print(users_df)
# print("\nCategories DataFrame:")
print(categories_df)
# print("\nExpenses DataFrame:")
print(expenses_df)



import pandas as pd
import numpy as np
import random
import string

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

# Display DataFrames
# print("Users DataFrame:")
# print(users_df)
# print("\nCategories DataFrame:")
# print(categories_df)
# print("\nExpenses DataFrame:")
# print(expenses_df)

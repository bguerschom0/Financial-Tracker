# Use Cases

This document outlines the key use cases for the Financial Tracker application.

## User Account Management

### UC-01: User Registration
**Primary Actor**: New User
**Description**: A new user creates an account to use the application.
**Steps**:
1. User navigates to Registration page
2. User enters full name
3. Username is automatically generated based on the user's name
4. User creates and confirms a password
5. User accepts terms and conditions
6. System validates the input and creates the account
7. User is redirected to the login page

### UC-02: User Login
**Primary Actor**: Registered User
**Description**: A registered user logs into their account.
**Steps**:
1. User navigates to Login page
2. User enters username and password
3. System validates credentials
4. User is redirected to the Dashboard

### UC-03: Update Profile
**Primary Actor**: Authenticated User
**Description**: User updates their profile information.
**Steps**:
1. User navigates to Profile page
2. User modifies personal information (name, language, timezone, currency)
3. User saves changes
4. System updates the user profile

### UC-04: Change Password
**Primary Actor**: Authenticated User
**Description**: User changes their account password.
**Steps**:
1. User navigates to Profile page
2. User enters current password and new password
3. System verifies current password and updates to new password

### UC-05: Account Deletion
**Primary Actor**: Authenticated User
**Description**: User permanently deletes their account.
**Steps**:
1. User navigates to Profile page
2. User selects "Delete Account"
3. System confirms the action
4. System deletes all user data and account
5. User is redirected to the landing page

## Financial Management

### UC-06: Add Income
**Primary Actor**: Authenticated User
**Description**: User records a new income transaction.
**Steps**:
1. User navigates to Income page
2. User selects "Add Income"
3. User enters income details (amount, date, category, description)
4. System saves the income transaction
5. Income list is updated

### UC-07: Add Expense
**Primary Actor**: Authenticated User
**Description**: User records a new expense transaction.
**Steps**:
1. User navigates to Expenses page
2. User selects "Add Expense"
3. User enters expense details (amount, date, category, description)
4. System saves the expense transaction
5. Expense list is updated

### UC-08: Manage Debt
**Primary Actor**: Authenticated User
**Description**: User adds and tracks a debt.
**Steps**:
1. User navigates to Debts page
2. User selects "Add New Debt"
3. User enters debt details (name, amount, interest rate, due date)
4. System saves the debt information
5. Debt list is updated with progress tracking

### UC-09: Create Savings Goal
**Primary Actor**: Authenticated User
**Description**: User sets up a savings goal.
**Steps**:
1. User navigates to Savings page
2. User selects "Add New Goal"
3. User enters savings goal details (name, target amount, target date)
4. System saves the savings goal
5. Savings goal list is updated with progress tracking

### UC-10: View Financial Dashboard
**Primary Actor**: Authenticated User
**Description**: User views a summary of their financial status.
**Steps**:
1. User navigates to Dashboard page
2. System displays summary of balances, income, expenses
3. System shows recent transactions and financial trends

## Reporting and Analysis

### UC-11: Generate Financial Reports
**Primary Actor**: Authenticated User
**Description**: User generates reports based on their financial data.
**Steps**:
1. User navigates to Reports page
2. User selects report type and date range
3. System generates visual reports of income, expenses, and savings
4. User can export reports in CSV format

### UC-12: View Income Analysis
**Primary Actor**: Authenticated User
**Description**: User examines detailed income breakdown.
**Steps**:
1. User navigates to Reports page
2. User selects "Income Analysis"
3. System displays income distribution by category
4. User can filter by time period

### UC-13: View Expense Analysis
**Primary Actor**: Authenticated User
**Description**: User examines detailed expense breakdown.
**Steps**:
1. User navigates to Reports page
2. User selects "Expense Analysis"
3. System displays expense distribution by category
4. User can filter by time period

## Admin Functions

### UC-14: Manage Users (Admin)
**Primary Actor**: Admin User
**Description**: Admin manages user accounts.
**Steps**:
1. Admin navigates to User Management page
2. Admin can view all user accounts
3. Admin can add new users
4. Admin can reset user passwords
5. Admin can delete user accounts

### UC-15: Reset User Password (Admin)
**Primary Actor**: Admin User
**Description**: Admin resets a user's password.
**Steps**:
1. Admin navigates to User Management page
2. Admin selects a user account
3. Admin selects "Reset Password"
4. Admin enters new password for the user
5. System updates the user's password

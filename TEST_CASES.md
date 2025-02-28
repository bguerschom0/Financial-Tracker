# Test Cases

This document outlines test cases for the Financial Tracker application.

## Authentication Tests

### TC-01: User Registration
**Description**: Test the user registration process.
**Prerequisites**: None
**Test Steps**:
1. Navigate to the Registration page
2. Enter valid full name "John Doe"
3. Verify that a username is automatically generated
4. Enter password "Password123!" and confirm password "Password123!"
5. Check terms and conditions box
6. Click "Create Account" button
**Expected Result**: User account is created. User is redirected to login page with success notification.
**Status**: Pass/Fail

### TC-02: Login with Valid Credentials
**Description**: Test user login with valid credentials.
**Prerequisites**: User account exists
**Test Steps**:
1. Navigate to the Login page
2. Enter valid username and password
3. Click "Sign in" button
**Expected Result**: User is logged in and redirected to Dashboard.
**Status**: Pass/Fail

### TC-03: Login with Invalid Credentials
**Description**: Test user login with invalid credentials.
**Prerequisites**: None
**Test Steps**:
1. Navigate to the Login page
2. Enter invalid username or password
3. Click "Sign in" button
**Expected Result**: Error message is displayed. User remains on login page.
**Status**: Pass/Fail

### TC-04: Password Change
**Description**: Test changing user password.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Profile page
2. Click "Change Password" button
3. Enter current password
4. Enter new password and confirm new password
5. Click "Update Password" button
**Expected Result**: Password is changed. Success notification is displayed.
**Status**: Pass/Fail

### TC-05: Inactivity Auto-Logout
**Description**: Test automatic logout after inactivity.
**Prerequisites**: User is logged in
**Test Steps**:
1. Login to the application
2. Remain inactive for 5 minutes
**Expected Result**: User is automatically logged out and redirected to login page with a notification.
**Status**: Pass/Fail

## Financial Data Tests

### TC-06: Add Income Transaction
**Description**: Test adding a new income transaction.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Income page
2. Click "Add Income" button
3. Fill in the form with valid data:
   - Description: "Monthly Salary"
   - Amount: 5000
   - Category: "Salary"
   - Date: Current date
4. Click "Save" button
**Expected Result**: Income transaction is saved. Income list is updated to include the new transaction.
**Status**: Pass/Fail

### TC-07: Add Expense Transaction
**Description**: Test adding a new expense transaction.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Expenses page
2. Click "Add Expense" button
3. Fill in the form with valid data:
   - Description: "Grocery Shopping"
   - Amount: 200
   - Category: "Food"
   - Date: Current date
4. Click "Save" button
**Expected Result**: Expense transaction is saved. Expense list is updated to include the new transaction.
**Status**: Pass/Fail

### TC-08: Edit Transaction
**Description**: Test editing an existing transaction.
**Prerequisites**: User is logged in and has at least one transaction
**Test Steps**:
1. Navigate to Income or Expenses page
2. Click "Edit" on an existing transaction
3. Modify the description to "Updated Transaction"
4. Click "Update" button
**Expected Result**: Transaction is updated with new information.
**Status**: Pass/Fail

### TC-09: Delete Transaction
**Description**: Test deleting a transaction.
**Prerequisites**: User is logged in and has at least one transaction
**Test Steps**:
1. Navigate to Income or Expenses page
2. Click "Delete" on an existing transaction
3. Confirm deletion in the confirmation dialog
**Expected Result**: Transaction is deleted and removed from the list.
**Status**: Pass/Fail

### TC-10: Add Debt
**Description**: Test adding a new debt.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Debts page
2. Click "Add New Debt" button
3. Fill in the form with valid data:
   - Name: "Car Loan"
   - Total Amount: 25000
   - Remaining Amount: 20000
   - Interest Rate: 4.5
   - Due Date: 1 year from now
4. Click "Add Debt" button
**Expected Result**: Debt is added and displayed in the debts list.
**Status**: Pass/Fail

### TC-11: Add Savings Goal
**Description**: Test adding a new savings goal.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Savings page
2. Click "Add New Goal" button
3. Fill in the form with valid data:
   - Name: "Emergency Fund"
   - Target Amount: 10000
   - Current Amount: 2000
   - Target Date: 6 months from now
4. Click "Add Goal" button
**Expected Result**: Savings goal is added and displayed in the goals list with proper progress calculation.
**Status**: Pass/Fail

## User Interface Tests

### TC-12: Responsive Design - Mobile
**Description**: Test application responsiveness on mobile devices.
**Prerequisites**: None
**Test Steps**:
1. Open application on a mobile device or using mobile emulation (375px width)
2. Navigate through all main pages: Dashboard, Income, Expenses, Debts, Savings, Reports, Profile
3. Test all major functionality
**Expected Result**: All pages display correctly and are usable on mobile. Elements adapt to smaller screen size.
**Status**: Pass/Fail

### TC-13: Responsive Design - Tablet
**Description**: Test application responsiveness on tablet devices.
**Prerequisites**: None
**Test Steps**:
1. Open application on a tablet device or using tablet emulation (768px width)
2. Navigate through all main pages
3. Test all major functionality
**Expected Result**: All pages display correctly and are usable on tablet. Elements adapt to medium screen size.
**Status**: Pass/Fail

### TC-14: Form Validation
**Description**: Test form validation for required fields.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Income page
2. Click "Add Income" button
3. Try to submit the form without filling required fields
**Expected Result**: Form submission fails. Error messages displayed for required fields.
**Status**: Pass/Fail

## Reporting Tests

### TC-15: Generate Income Report
**Description**: Test income report generation.
**Prerequisites**: User is logged in and has income transactions
**Test Steps**:
1. Navigate to Reports page
2. Select "Income Analysis" as report type
3. Select "This Month" as time period
**Expected Result**: Income distribution chart displays correctly showing income by category.
**Status**: Pass/Fail

### TC-16: Generate Expense Report
**Description**: Test expense report generation.
**Prerequisites**: User is logged in and has expense transactions
**Test Steps**:
1. Navigate to Reports page
2. Select "Expense Analysis" as report type
3. Select "This Month" as time period
**Expected Result**: Expense distribution chart displays correctly showing expenses by category.
**Status**: Pass/Fail

### TC-17: Export Report to CSV
**Description**: Test report export functionality.
**Prerequisites**: User is logged in and has transactions
**Test Steps**:
1. Navigate to Reports page
2. Click "Export Report" button
**Expected Result**: CSV file is downloaded containing transaction data.
**Status**: Pass/Fail

## Multi-Currency Tests

### TC-18: Change Default Currency
**Description**: Test changing the user's default currency.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Profile page
2. Change currency from "USD" to "RWF" (Rwandan Franc)
3. Save changes
**Expected Result**: User's currency preference is updated. All financial displays use the new currency format.
**Status**: Pass/Fail

### TC-19: Add Transaction with Different Currency
**Description**: Test adding a transaction with a different currency.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Income page
2. Click "Add Income" button
3. Fill in form with valid data
4. Change currency to "EUR" (different from user default)
5. Save transaction
**Expected Result**: Transaction is saved with the selected currency and displayed correctly.
**Status**: Pass/Fail

## Admin Tests

### TC-20: Admin User Management
**Description**: Test admin user management capabilities.
**Prerequisites**: Admin user is logged in
**Test Steps**:
1. Navigate to User Management page
2. Verify list of user accounts is displayed
3. Click "Add User" and create a test user
4. Edit the test user's information
5. Reset the test user's password
6. Delete the test user
**Expected Result**: All admin operations complete successfully with appropriate notifications.
**Status**: Pass/Fail

## Data Persistence Tests

### TC-21: Form Data Persistence on Refresh
**Description**: Test that form data is not lost on page refresh.
**Prerequisites**: User is logged in
**Test Steps**:
1. Navigate to Income page
2. Click "Add Income"
3. Fill in some form fields but don't submit
4. Refresh the page
**Expected Result**: Form data is preserved after page refresh.
**Status**: Pass/Fail

### TC-22: Account Deletion
**Description**: Test complete account deletion with all related data.
**Prerequisites**: User is logged in and has various transactions, debts, and savings goals
**Test Steps**:
1. Navigate to Profile page
2. Click "Delete Account"
3. Confirm deletion
4. Try to log in with deleted account credentials
**Expected Result**: Account and all associated data are deleted. Login attempt fails.
**Status**: Pass/Fail

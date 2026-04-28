import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterSortBar from './components/FilterSortBar';
import { expenseService } from './api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState('0.00');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('date_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Standard expense categories
  const defaultCategories = [
    'Food & Dining',
    'Transport',
    'Shopping',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Education',
    'Other'
  ];

  // Fetch expenses
  const fetchExpenses = async (category = null, sort = 'date_desc') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await expenseService.getExpenses(category, sort);
      setExpenses(response.data.expenses || []);
      setTotal(response.data.total || '0.00');
    } catch (err) {
      setError('Failed to fetch expenses. Please try again.');
      console.error('Error fetching expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchExpenses(selectedCategory, sortOrder);
  }, []);

  // Handle expense creation
  const handleAddExpense = async (expenseData) => {
    try {
      setError(null);
      await expenseService.createExpense(expenseData);
      setSuccessMessage('Expense added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh expenses
      await fetchExpenses(selectedCategory, sortOrder);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Invalid input. Please check your data.');
      } else {
        setError('Failed to create expense. Please try again.');
      }
      console.error('Error creating expense:', err);
    }
  };

  // Handle category filter
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    await fetchExpenses(category, sortOrder);
  };

  // Handle sort change
  const handleSortChange = async (sort) => {
    setSortOrder(sort);
    await fetchExpenses(selectedCategory, sort);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Personal Expense Tracker</h1>
        <p>Keep track of your spending and manage your finances</p>
      </header>

      <main className="app-main">
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="container">
          <div className="form-section">
            <h2>Add New Expense</h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          <div className="expenses-section">
            <div className="section-header">
              <h2>Your Expenses</h2>
              <div className="total-display">
                <span className="total-label">Total:</span>
                <span className="total-amount">₹{total}</span>
              </div>
            </div>

            <FilterSortBar
              categories={defaultCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />

            {isLoading && <div className="loading">Loading expenses...</div>}

            {!isLoading && expenses.length === 0 ? (
              <div className="empty-state">
                <p>No expenses yet. Add one to get started!</p>
              </div>
            ) : (
              <ExpenseList expenses={expenses} />
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Expense Tracker v1.0 | Built with React</p>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterSortBar from '../components/FilterSortBar';
import { expenseService } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState('0.00');
  const [summary, setSummary] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('date_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Fetch expenses and summary
  const fetchExpenses = async (category = null, sort = 'date_desc') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await expenseService.getExpenses(category, sort);
      setExpenses(response.data.expenses || []);
      setTotal(response.data.total || '0.00');

      // Fetch summary
      const summaryResponse = await expenseService.getDashboardSummary();
      setSummary(summaryResponse.data.summary);
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
  }, [selectedCategory, sortOrder]);

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
      setError(err.response?.data?.details || 'Failed to add expense');
      console.error('Error adding expense:', err);
    }
  };

  // Handle expense deletion
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      setError(null);
      await expenseService.deleteExpense(id);
      setSuccessMessage('Expense deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh expenses
      await fetchExpenses(selectedCategory, sortOrder);
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error('Error deleting expense:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-gray-600">Welcome, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-blue-600">₹{summary.totalAmount}</p>
              <p className="text-gray-500 text-xs mt-2">{summary.totalExpenses} transactions</p>
            </div>

            {summary.categoryBreakdown.length > 0 && (
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Top Category</h3>
                <p className="text-xl font-bold text-purple-600">
                  {summary.categoryBreakdown.reduce((top, curr) => 
                    curr.amount > top.amount ? curr : top
                  ).category}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  ₹{summary.categoryBreakdown.reduce((top, curr) => 
                    curr.amount > top.amount ? curr : top
                  ).amount}
                </p>
              </div>
            )}

            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Categories</h3>
              <p className="text-3xl font-bold text-green-600">{summary.categoryBreakdown.length}</p>
              <p className="text-gray-500 text-xs mt-2">distinct categories used</p>
            </div>
          </div>
        )}

        {/* Success and Error Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Expense Form */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Expense</h2>
          <ExpenseForm
            onAddExpense={handleAddExpense}
            categories={defaultCategories}
          />
        </div>

        {/* Filter and Sort Bar */}
        <FilterSortBar
          selectedCategory={selectedCategory}
          sortOrder={sortOrder}
          categories={defaultCategories}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        {/* Expense List */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Expenses ({expenses.length})
            {selectedCategory && ` - ${selectedCategory}`}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-600">Loading expenses...</div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No expenses yet. Add your first expense above!</p>
            </div>
          ) : (
            <ExpenseList
              expenses={expenses}
              totalAmount={total}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
        </div>
      </main>
    </div>
  );
}

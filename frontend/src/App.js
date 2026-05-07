import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
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

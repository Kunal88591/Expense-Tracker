import React from 'react';
import '../styles/ExpenseList.css';

function ExpenseList({ expenses }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <div className="empty-list">No expenses to display</div>
      ) : (
        <div className="table-wrapper">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th className="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id} className="expense-row">
                  <td className="date-cell">{formatDate(expense.date)}</td>
                  <td className="category-cell">
                    <span className="category-badge">{expense.category}</span>
                  </td>
                  <td className="description-cell">{expense.description}</td>
                  <td className="amount-cell">₹{formatAmount(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;

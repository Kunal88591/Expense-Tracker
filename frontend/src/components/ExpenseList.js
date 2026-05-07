import React from 'react';

function ExpenseList({ expenses, totalAmount, onDeleteExpense }) {
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

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-amber-100 text-amber-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Utilities': 'bg-green-100 text-green-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No expenses to display
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-700">{formatDate(expense.date)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{expense.description}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                      ₹{formatAmount(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition"
                        title="Delete expense"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-gray-200 pt-4 mt-4 flex justify-end">
            <div className="text-lg font-bold text-gray-900">
              Total: <span className="text-blue-600">₹{formatAmount(totalAmount)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseList;

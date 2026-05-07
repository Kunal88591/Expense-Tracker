import React, { useState } from 'react';

function ExpenseForm({ onAddExpense, categories }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }
    if (!formData.category || formData.category.trim() === '') {
      errors.category = 'Please select a category';
    }
    if (!formData.description || formData.description.trim() === '') {
      errors.description = 'Description is required';
    }
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      errors.date = 'Please select a valid date';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });

      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setFieldErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹) *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={isSubmitting}
            className={`input-field ${fieldErrors.amount ? 'border-red-500' : ''}`}
          />
          {fieldErrors.amount && <span className="error-message">{fieldErrors.amount}</span>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`input-field ${fieldErrors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {fieldErrors.category && <span className="error-message">{fieldErrors.category}</span>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            disabled={isSubmitting}
            className={`input-field ${fieldErrors.description ? 'border-red-500' : ''}`}
          />
          {fieldErrors.description && <span className="error-message">{fieldErrors.description}</span>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`input-field ${fieldErrors.date ? 'border-red-500' : ''}`}
          />
          {fieldErrors.date && <span className="error-message">{fieldErrors.date}</span>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn-primary w-full md:w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}

export default ExpenseForm;
          ))}
        </select>
        {fieldErrors.category && <span className="error-text">{fieldErrors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What did you spend on?"
          disabled={isSubmitting}
          className={fieldErrors.description ? 'field-error' : ''}
        />
        {fieldErrors.description && <span className="error-text">{fieldErrors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          disabled={isSubmitting}
          className={fieldErrors.date ? 'field-error' : ''}
        />
        {fieldErrors.date && <span className="error-text">{fieldErrors.date}</span>}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}

export default ExpenseForm;

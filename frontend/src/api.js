import axios from 'axios';

/**
 * API service for Vercel Serverless Functions
 * All calls go to /api/expenses (relative URLs)
 */
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * UUID v4 generator
 * Used for idempotency keys to prevent duplicate expense creation
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Retry logic for failed requests
 * Exponential backoff: 1s → 2s → 4s
 * Only retries on network errors or 5xx server errors
 */
const retryRequest = async (fn, maxRetries = 3, delayMs = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Only retry on network errors or 5xx status
      if (!error.response || error.response.status >= 500) {
        await new Promise(resolve =>
          setTimeout(resolve, delayMs * Math.pow(2, i))
        );
      } else {
        throw error;
      }
    }
  }
};

export const expenseService = {
  /**
   * Create a new expense with idempotency
   * - Generates unique idempotency_key
   * - Server prevents duplicates for same key
   * - Safe to retry without creating duplicate expenses
   */
  createExpense: async (expense) => {
    const idempotencyKey = expense.idempotency_key || `expense-${generateUUID()}`;
    const payload = {
      ...expense,
      idempotency_key: idempotencyKey
    };

    return retryRequest(() =>
      api.post('/api/expenses', payload)
    );
  },

  /**
   * Get all expenses with optional filtering and sorting
   * Query params:
   *   - category: filter by category name
   *   - sort: 'date_desc' (default) or 'date_asc'
   */
  getExpenses: async (category = null, sort = 'date_desc') => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('sort', sort);

    return retryRequest(() =>
      api.get(`/api/expenses?${params.toString()}`)
    );
  }
};

export default api;

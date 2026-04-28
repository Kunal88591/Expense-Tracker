import {
  readExpenses,
  addExpense,
  getAllExpenses,
  calculateTotal,
} from './utils/storage.js';
import { validateExpense } from './utils/validation.js';
import {
  generateUUID,
  toPaise,
  toDecimal,
} from './utils/helpers.js';

/**
 * Vercel Serverless Function Handler
 * POST /api/expenses - Create new expense
 * GET /api/expenses - List all expenses with optional filters
 */
export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST /api/expenses - Create new expense
    if (req.method === 'POST') {
      const { amount, category, description, date, idempotency_key } = req.body;

      // Validate input
      const validation = validateExpense({ amount, category, description, date });
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        });
      }

      // Create new expense with built-in idempotency check
      const id = generateUUID();
      const created_at = new Date().toISOString();
      
      try {
        const amountInPaise = toPaise(amount);

        const newExpense = {
          id,
          amount: amountInPaise, // Store as INTEGER (paise)
          category: category.trim(),
          description: description.trim(),
          date,
          created_at,
          idempotency_key: idempotency_key || null,
        };

        // Save to storage (atomic operation, handles idempotency)
        const { expense: saved, isNew } = addExpense(newExpense);

        // Return with amount as decimal
        const statusCode = isNew ? 201 : 200;
        const message = isNew 
          ? 'Expense created successfully'
          : 'Expense already exists (duplicate request with same idempotency key)';

        return res.status(statusCode).json({
          message,
          expense: {
            ...saved,
            amount: parseFloat(toDecimal(saved.amount)),
          },
        });
      } catch (validationError) {
        return res.status(400).json({
          error: 'Invalid amount',
          details: validationError.message,
        });
      }
    }

    // GET /api/expenses - List all expenses with filters
    if (req.method === 'GET') {
      const { category, sort } = req.query;
      const expenses = getAllExpenses(category || null, sort || 'date_desc');

      // Calculate total as integer paise
      const totalInPaise = calculateTotal(expenses);
      const totalDecimal = toDecimal(totalInPaise);

      return res.status(200).json({
        expenses: expenses.map(e => ({
          ...e,
          amount: parseFloat(toDecimal(e.amount)), // Convert back to decimal for API response
        })),
        total: totalDecimal,
        count: expenses.length,
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

import express from 'express';
import Expense from '../models/Expense.js';
import protect from '../middleware/auth.js';
import {
  validateExpense,
  validateAmount,
  toPaise,
  toDecimal
} from '../utils/helpers.js';

const router = express.Router();

// All routes protected - require authentication
router.use(protect);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for logged in user
 * @query   category, sort (date_asc, date_desc, amount_asc, amount_desc)
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'date_desc' } = req.query;
    
    // Build query - only get expenses for current user
    let query = { userId: req.user.id };
    if (category) {
      query.category = category;
    }

    // Build sort
    let sortQuery = {};
    switch (sort) {
      case 'date_asc':
        sortQuery = { date: 1 };
        break;
      case 'date_desc':
        sortQuery = { date: -1 };
        break;
      case 'amount_asc':
        sortQuery = { amount: 1 };
        break;
      case 'amount_desc':
        sortQuery = { amount: -1 };
        break;
      default:
        sortQuery = { date: -1 };
    }

    // Fetch expenses
    const expenses = await Expense.find(query).sort(sortQuery);

    // Calculate total
    const totalPaise = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const total = toDecimal(totalPaise);

    // Format expenses for response
    const formattedExpenses = expenses.map(expense => ({
      id: expense._id,
      amount: parseFloat(toDecimal(expense.amount)),
      category: expense.category,
      description: expense.description,
      date: expense.date.toISOString().split('T')[0],
      createdAt: expense.createdAt
    }));

    res.status(200).json({
      message: 'Expenses retrieved successfully',
      expenses: formattedExpenses,
      total,
      count: formattedExpenses.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch expenses',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/expenses
 * @desc    Create new expense (with idempotency)
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date, idempotency_key } = req.body;

    // Validate input
    const validation = validateExpense({ amount, category, description, date });
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Check for idempotency - if same key exists for this user, return existing expense
    if (idempotency_key) {
      const existingExpense = await Expense.findOne({
        userId: req.user.id,
        idempotency_key
      });

      if (existingExpense) {
        return res.status(200).json({
          message: 'Expense already exists (duplicate request with same idempotency key)',
          expense: {
            id: existingExpense._id,
            amount: parseFloat(toDecimal(existingExpense.amount)),
            category: existingExpense.category,
            description: existingExpense.description,
            date: existingExpense.date.toISOString().split('T')[0],
            createdAt: existingExpense.createdAt
          },
          isNew: false
        });
      }
    }

    // Convert amount to paise
    let amountInPaise;
    try {
      amountInPaise = toPaise(amount);
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: { amount: error.message }
      });
    }

    // Create expense
    const expense = new Expense({
      userId: req.user.id,
      amount: amountInPaise,
      category: category.trim(),
      description: description.trim(),
      date: new Date(date),
      idempotency_key: idempotency_key || null
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense created successfully',
      expense: {
        id: expense._id,
        amount: parseFloat(toDecimal(expense.amount)),
        category: expense.category,
        description: expense.description,
        date: expense.date.toISOString().split('T')[0],
        createdAt: expense.createdAt
      },
      isNew: true
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create expense',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/expenses/:id
 * @desc    Get single expense
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        error: 'Expense not found',
        details: 'The requested expense does not exist or you do not have access'
      });
    }

    res.status(200).json({
      message: 'Expense retrieved successfully',
      expense: {
        id: expense._id,
        amount: parseFloat(toDecimal(expense.amount)),
        category: expense.category,
        description: expense.description,
        date: expense.date.toISOString().split('T')[0],
        createdAt: expense.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch expense',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        error: 'Expense not found',
        details: 'The requested expense does not exist or you do not have access'
      });
    }

    await Expense.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message: 'Expense deleted successfully',
      expense: {
        id: expense._id,
        amount: parseFloat(toDecimal(expense.amount)),
        category: expense.category,
        description: expense.description,
        date: expense.date.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete expense',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/expenses/summary/dashboard
 * @desc    Get expense summary for dashboard
 * @access  Private
 */
router.get('/summary/dashboard', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    // Calculate totals
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Group by category
    const byCategory = {};
    expenses.forEach(expense => {
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = 0;
      }
      byCategory[expense.category] += expense.amount;
    });

    // Format category breakdown
    const categoryBreakdown = Object.entries(byCategory).map(([category, amount]) => ({
      category,
      amount: parseFloat(toDecimal(amount))
    }));

    res.status(200).json({
      message: 'Dashboard summary retrieved',
      summary: {
        totalExpenses: expenses.length,
        totalAmount: parseFloat(toDecimal(totalAmount)),
        categoryBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch summary',
      details: error.message
    });
  }
});

export default router;

import fs from 'fs';
import path from 'path';

// Use /tmp for Vercel (ephemeral storage)
// In production, consider using a persistent external storage
const STORAGE_PATH = '/tmp/expenses.json';
const LOCK_PATH = '/tmp/expenses.lock';

/**
 * Simple file-based lock mechanism for concurrency safety
 * Note: This is a basic implementation. For true production reliability,
 * use an external database or distributed lock service.
 */
const acquireLock = (timeout = 5000) => {
  const startTime = Date.now();
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    try {
      // Try to create lock file exclusively
      fs.writeFileSync(LOCK_PATH, Date.now().toString(), { flag: 'wx' });
      return true;
    } catch (err) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Lock acquisition timeout');
      }
      // Wait a small amount before retrying
      const now = Date.now();
      while (Date.now() - now < 100) {
        // Busy wait (in production, use setTimeout/promises)
      }
      attempts++;
    }
  }
  throw new Error('Failed to acquire lock');
};

/**
 * Release the lock file
 */
const releaseLock = () => {
  try {
    fs.unlinkSync(LOCK_PATH);
  } catch (err) {
    // Lock file might not exist, that's ok
  }
};

/**
 * Read all expenses from JSON file
 * Throws error on corruption (don't silently lose data)
 */
export const readExpenses = () => {
  try {
    if (!fs.existsSync(STORAGE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(STORAGE_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    // Don't silently swallow - data corruption is critical
    console.error('CRITICAL: Failed to read expenses - file may be corrupted', err);
    throw new Error(`Storage read failed: ${err.message}`);
  }
};

/**
 * Write expenses to JSON file (MUST already hold lock)
 * Called from functions that hold the lock
 */
const writeExpensesUnlocked = (expenses) => {
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(expenses, null, 2), 'utf-8');
};

/**
 * Write expenses to JSON file with lock
 */
export const writeExpenses = (expenses) => {
  acquireLock();
  try {
    writeExpensesUnlocked(expenses);
  } finally {
    releaseLock();
  }
};

/**
 * Add new expense (with idempotency check)
 * Atomic operation: lock held throughout check and write
 */
export const addExpense = (expense) => {
  acquireLock();
  try {
    const expenses = readExpenses();

    // Check if idempotency key already exists (ATOMIC with write)
    if (expense.idempotency_key) {
      const existing = expenses.find(e => e.idempotency_key === expense.idempotency_key);
      if (existing) {
        return { expense: existing, isNew: false }; // Return existing, indicate it's a duplicate
      }
    }

    // Add new expense and write atomically
    expenses.push(expense);
    writeExpensesUnlocked(expenses);
    return { expense, isNew: true };
  } finally {
    releaseLock();
  }
};

/**
 * Get all expenses with optional filtering and sorting (with lock)
 * Prevents reading file mid-write
 */
export const getAllExpenses = (category = null, sort = 'date_desc') => {
  acquireLock();
  try {
    let expenses = readExpenses();

    // Filter by category if provided
    if (category) {
      expenses = expenses.filter(e => e.category === category);
    }

    // Sort
    if (sort === 'date_desc') {
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'date_asc') {
      expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return expenses;
  } finally {
    releaseLock();
  }
};

/**
 * Calculate total amount
 */
export const calculateTotal = (expenses) => {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
};

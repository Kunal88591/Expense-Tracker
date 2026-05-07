/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return {
    token: jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
  };
};

/**
 * Convert decimal amount (₹) to paise (INTEGER)
 * Example: 250.75 → 25075
 */
export const toPaise = (decimalAmount) => {
  const paise = Math.round(parseFloat(decimalAmount) * 100);
  if (!Number.isInteger(paise)) {
    throw new Error(`Invalid paise conversion: ${decimalAmount} → ${paise}`);
  }
  return paise;
};

/**
 * Convert paise (INTEGER) to decimal amount string (₹)
 * Example: 25075 → "250.75"
 */
export const toDecimal = (paiseAmount) => {
  return (Math.round(paiseAmount) / 100).toFixed(2);
};

/**
 * Validate amount
 */
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Amount must be a positive number' };
  }
  return { valid: true };
};

/**
 * Validate category
 */
export const validateCategory = (category) => {
  const validCategories = [
    'Food & Dining',
    'Transport',
    'Shopping',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Education',
    'Other'
  ];

  if (!validCategories.includes(category)) {
    return { valid: false, error: `Invalid category. Must be one of: ${validCategories.join(', ')}` };
  }
  return { valid: true };
};

/**
 * Validate description
 */
export const validateDescription = (description) => {
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return { valid: false, error: 'Description is required' };
  }
  if (description.length > 500) {
    return { valid: false, error: 'Description cannot exceed 500 characters' };
  }
  return { valid: true };
};

/**
 * Validate date format
 */
export const validateDate = (date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  return { valid: true };
};

/**
 * Validate expense
 */
export const validateExpense = (data) => {
  const errors = {};

  const amountValidation = validateAmount(data.amount);
  if (!amountValidation.valid) errors.amount = amountValidation.error;

  const categoryValidation = validateCategory(data.category);
  if (!categoryValidation.valid) errors.category = categoryValidation.error;

  const descriptionValidation = validateDescription(data.description);
  if (!descriptionValidation.valid) errors.description = descriptionValidation.error;

  const dateValidation = validateDate(data.date);
  if (!dateValidation.valid) errors.date = dateValidation.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

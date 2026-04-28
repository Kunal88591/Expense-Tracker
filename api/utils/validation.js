/**
 * Validate amount
 * Returns error message if invalid, null if valid
 */
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) {
    return 'Amount must be a positive number';
  }
  return null;
};

/**
 * Validate category
 */
export const validateCategory = (category) => {
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return 'Category is required';
  }
  return null;
};

/**
 * Validate description
 */
export const validateDescription = (description) => {
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return 'Description is required';
  }
  return null;
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDate = (date) => {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return 'Date must be in YYYY-MM-DD format';
  }
  return null;
};

/**
 * Validate complete expense object
 */
export const validateExpense = (data) => {
  const errors = {};

  const amountError = validateAmount(data.amount);
  if (amountError) errors.amount = amountError;

  const categoryError = validateCategory(data.category);
  if (categoryError) errors.category = categoryError;

  const descriptionError = validateDescription(data.description);
  if (descriptionError) errors.description = descriptionError;

  const dateError = validateDate(data.date);
  if (dateError) errors.date = dateError;

  return Object.keys(errors).length === 0
    ? { valid: true }
    : { valid: false, errors };
};

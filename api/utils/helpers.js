/**
 * Generate UUID v4
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Convert decimal amount (₹) to paise (INTEGER)
 * Example: 250.75 → 25075
 * VALIDATES: Result is an integer
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
 * Always returns string with 2 decimal places
 */
export const toDecimal = (paiseAmount) => {
  return (Math.round(paiseAmount) / 100).toFixed(2);
};

/**
 * Format amount for display (returns string)
 * Input can be paise (integer) or decimal (number/string)
 * Always returns decimal string with 2 places
 */
export const formatAmount = (amount) => {
  // If it looks like paise (large integer), convert it
  if (Number.isInteger(amount) && amount > 100) {
    return toDecimal(amount);
  }
  // Otherwise treat as decimal
  return parseFloat(amount).toFixed(2);
};

/**
 * Create error response
 */
export const errorResponse = (statusCode, message, details = null) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      error: message,
      ...(details && { details }),
    }),
  };
};

/**
 * Create success response
 */
export const successResponse = (statusCode, data) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  };
};

/**
 * Parse query string
 */
export const parseQuery = (queryString) => {
  const params = new URLSearchParams(queryString || '');
  return {
    category: params.get('category'),
    sort: params.get('sort') || 'date_desc',
  };
};

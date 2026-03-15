/**
 * Formats a number to Indian Rupee currency format
 * e.g., 1234567 -> ₹12,34,567
 *
 * @param {number} value - The numerical value to format.
 * @param {number} maximumFractionDigits - Rounding for decimals. Default is 0.
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, maximumFractionDigits = 0) {
  if (value === undefined || value === null || isNaN(value)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(value);
}

/**
 * Returns an abbreviated formatting for large Indian numbers (Lakhs, Crores)
 *
 * @param {number} value - Numerical value to format
 * @returns {string} e.g., "₹1.50 Cr" or "₹50.0 L"
 */
export function formatLargeCurrency(value) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return formatCurrency(value);
}

/**
 * Parses Indian formatted strings back to numbers if needed
 * Handles commas and Rupee symbols.
 *
 * @param {string} valStr - The formatted string
 * @returns {number} The parsed numerical value
 */
export function parseCurrency(valStr) {
  const cleanStr = String(valStr).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
}

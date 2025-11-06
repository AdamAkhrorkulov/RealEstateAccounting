// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (UZ format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+998\d{9}$/;
  return phoneRegex.test(phone);
};

// Passport series validation
export const isValidPassportSeries = (series: string): boolean => {
  const seriesRegex = /^[A-Z]{2}$/;
  return seriesRegex.test(series);
};

// Passport number validation
export const isValidPassportNumber = (number: string): boolean => {
  const numberRegex = /^\d{7}$/;
  return numberRegex.test(number);
};

// Required field validation
export const required = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Positive number validation
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

// Non-negative number validation
export const isNonNegativeNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

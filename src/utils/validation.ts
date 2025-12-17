// Validation utility functions

import { VALIDATION } from '@/constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
    };
  }
  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`,
    };
  }
  return { isValid: true };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!VALIDATION.PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
  return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: unknown, fieldName: string = 'Field'): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate number range
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult => {
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  return { isValid: true };
};


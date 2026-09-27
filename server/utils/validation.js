import validator from 'validator';
import { AppError } from '../middleware/errorHandler.js';

export const validateEmail = (email) => {
  if (!validator.isEmail(email)) throw new AppError('Invalid email', 400);
  return email.toLowerCase();
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }
  return password;
};

export const validateRequired = (fields, data) => {
  const missing = fields.filter(f => !data[f] || !String(data[f]).trim());
  if (missing.length) throw new AppError(`Missing: ${missing.join(', ')}`, 400);
};

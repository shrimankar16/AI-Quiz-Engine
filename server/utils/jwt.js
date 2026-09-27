import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
  });
};

export const generatePasswordResetToken = (email) => {
  return jwt.sign({ email, type: 'reset' }, process.env.JWT_SECRET, { 
    expiresIn: '1h' 
  });
};

export const verifyPasswordResetToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.type !== 'reset') throw new Error('Invalid token type');
  return decoded.email;
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Record already exists' });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Server error',
  });
};

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

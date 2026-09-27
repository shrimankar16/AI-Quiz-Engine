import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken, generatePasswordResetToken, verifyPasswordResetToken } from '../utils/jwt.js';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation.js';
import { AppError } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    console.log('Registration attempt:', { ...req.body, password: '***' });
    
    const { name, email, password, role = 'student' } = req.body;
    
    validateRequired(['name', 'email', 'password'], req.body);
    const validEmail = validateEmail(email);
    validatePassword(password);
    
    // Validate role is one of the allowed values
    const validRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student';

    const exists = await prisma.user.findUnique({ where: { email: validEmail } });
    if (exists) throw new AppError('Email already registered', 409);

    console.log('Creating user with role:', validRole);
    
    const user = await prisma.user.create({
      data: {
        name,
        email: validEmail,
        password: await bcrypt.hash(password, 12),
        role: validRole,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    console.log('User created successfully:', user.email);
    
    const token = generateToken(user.id);
    res.status(201).json({ message: 'Registration successful', user, token });
  } catch (error) {
    console.error('Registration error:', error.message, error.stack);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    validateRequired(['email', 'password'], req.body);
    const validEmail = validateEmail(email);

    const user = await prisma.user.findUnique({ where: { email: validEmail } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ message: 'Login successful', user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => res.json({ message: 'Logged out' });

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email: validateEmail(email) } });
    
    if (user) {
      const token = generatePasswordResetToken(user.email);
      await prisma.passwordResetToken.upsert({
        where: { email: user.email },
        update: { token, createdAt: new Date() },
        create: { email: user.email, token },
      });
      
      res.json({ 
        message: 'Reset link sent',
        resetToken: token, // Remove in production
        resetLink: `${process.env.CLIENT_URL}/reset-password?token=${token}`
      });
    } else {
      res.json({ message: 'If account exists, reset link was sent' });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    validateRequired(['token', 'newPassword'], req.body);
    validatePassword(newPassword);

    const email = verifyPasswordResetToken(token);
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { email } });

    if (!resetToken || resetToken.token !== token) {
      throw new AppError('Invalid or expired token', 400);
    }

    const oneHourAgo = new Date(Date.now() - 3600000);
    if (resetToken.createdAt < oneHourAgo) {
      throw new AppError('Token expired', 400);
    }

    await prisma.user.update({
      where: { email },
      data: { password: await bcrypt.hash(newPassword, 12) },
    });

    await prisma.passwordResetToken.delete({ where: { email } });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => res.json({ user: req.user });

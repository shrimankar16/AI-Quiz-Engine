import prisma from '../config/database.js';

export const generateAccessCode = async () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code;
  let exists = true;

  while (exists) {
    code = Array(9).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    exists = await prisma.exam.findUnique({ where: { accessCode: code } });
  }

  return code;
};

export const formatAccessCode = (code) => 
  code ? `${code.slice(0,3)}-${code.slice(3,6)}-${code.slice(6,9)}` : code;

export const cleanAccessCode = (code) => 
  code ? code.replace(/-/g, '').toUpperCase() : code;

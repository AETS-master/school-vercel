import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
  } catch (error) {
    return null;
  }
}

export function checkStudentPassword(password) {
  return password === process.env.STUDENT_PASSWORD;
}

export function checkAdminPassword(password) {
  return password === process.env.ADMIN_PASSWORD;
}
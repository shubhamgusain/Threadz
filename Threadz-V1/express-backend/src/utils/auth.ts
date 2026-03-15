import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SECRET_KEY || 'development_secret_key_change_me_in_prod';
const ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60; // 30 days in minutes

export const getPasswordHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const createAccessToken = (data: object, expiresDeltaSeconds?: number): string => {
  const expiresIn = expiresDeltaSeconds || ACCESS_TOKEN_EXPIRE_MINUTES * 60;
  return jwt.sign(data, SECRET_KEY, { expiresIn });
};

export const decodeAccessToken = (token: string): any => {
  return jwt.verify(token, SECRET_KEY);
};

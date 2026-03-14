import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { getPasswordHash, verifyPassword, createAccessToken } from '../utils/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ detail: 'Email, password, and full_name are required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ detail: 'Email already registered' });
    }

    const hashed_password = await getPasswordHash(password.substring(0, 72));

    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash: hashed_password,
        full_name,
        phone: phone || null,
      },
    });

    res.status(201).json({
      user_id: newUser.user_id,
      email: newUser.email,
      message: 'Registration successful. Verification email sent.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    // Fastapi used 1440 mins defaults (24 hours) or the env, which we set to 30 days in utils
    const access_token = createAccessToken({ sub: user.email });

    res.json({
      access_token,
      refresh_token: 'dummy_refresh_token_for_now',
      token_type: 'bearer',
      expires_in: 30 * 24 * 60 * 60, // 30 days in seconds
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ detail: 'Email not found' });
    }

    res.json({
      message: 'Password reset instructions sent to your email',
      email,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
};

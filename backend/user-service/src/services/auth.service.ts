import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user.model.js';
import { RefreshToken } from '../models/refresh-token.model.js';
import { generateTokens } from '../middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.callbackUrl,
);

export const register = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // Save refresh token
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};

export const googleLogin = async (code: string) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      throw new Error('Google account must have an email');
    }

    let user = await User.findOne({ email: data.email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name: data.name || data.email.split('@')[0],
        email: data.email,
        password: Math.random().toString(36).slice(-16), // Dummy password
        picture: data.picture,
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { user, accessToken, refreshToken };
  } catch (error: any) {
    console.error('Google login error:', error);
    throw new Error(error.message || 'Google authentication failed');
  }
};

export const logout = async (token: string) => {
  await RefreshToken.findOneAndDelete({ token });
};

export const refresh = async (token: string) => {
  const storedToken = await RefreshToken.findOne({ token });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) await RefreshToken.deleteOne({ _id: storedToken._id });
    throw new Error('Invalid or expired refresh token');
  }

  const decoded: any = jwt.verify(token, config.jwtRefreshSecret);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error('User not found');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  // Update refresh token
  storedToken.token = newRefreshToken;
  storedToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await storedToken.save();

  return { accessToken, newRefreshToken };
};

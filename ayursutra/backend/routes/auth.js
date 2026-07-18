const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { loginSchema, registerSchema } = require('../validators/authValidator');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' });
  const refreshToken = jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
  return { accessToken, refreshToken };
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('authToken', accessToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: 15 * 60 * 1000, path: '/' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/auth' });
};

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    setTokenCookies(res, accessToken, refreshToken);
    res.json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role, dateOfBirth } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    const user = await User.create({ fullName, email, passwordHash, phone: phone || '', role: role || 'patient', dateOfBirth: dateOfBirth || null });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    setTokenCookies(res, accessToken, refreshToken);
    res.status(201).json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.post('/logout', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await User.findByIdAndUpdate(decoded.userId, { refreshToken: null, refreshTokenExpires: null });
  }
  res.clearCookie('authToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ success: true, message: 'Logged out successfully' });
});

router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token || new Date() > user.refreshTokenExpires) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const { accessToken, refreshToken: newToken } = generateTokens(user._id, user.role);
    user.refreshToken = newToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    setTokenCookies(res, accessToken, newToken);
    res.json({ success: true });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    res.json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, phone: user.phone } });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  const user = await User.findOne({ email });
  if (user) {
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }
  res.json({ success: true, message: 'If an account exists, a reset link will be sent' });
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and password are required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    await User.findByIdAndUpdate(decoded.userId, { passwordHash, refreshToken: null, refreshTokenExpires: null });
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }
});

module.exports = router;

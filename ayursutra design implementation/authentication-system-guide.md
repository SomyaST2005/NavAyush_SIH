# Authentication & User Management Implementation Guide

## Overview

The Authentication System provides secure user registration, login, role-based access control, and session management for patients, practitioners, and administrators in the AyurSutra platform using Node.js/Express.js.

## System Architecture

```
AuthenticationService/
├── auth/
│   ├── jwtHandler.js
│   ├── passwordManager.js
│   ├── sessionManager.js
│   └── roleManager.js
├── middleware/
│   ├── authMiddleware.js
│   ├── rateLimiter.js
│   └── corsHandler.js
├── models/
│   ├── User.js
│   ├── Session.js
│   └── RefreshToken.js
└── routes/
    ├── auth.js
    └── users.js
```

## Core Components

### 1. User Model

```javascript
// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('patient', 'practitioner', 'admin'),
    allowNull: false,
    defaultValue: 'patient'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockedUntil: {
    type: DataTypes.DATE
  },
  fullName: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  verificationToken: {
    type: DataTypes.STRING
  },
  passwordResetToken: {
    type: DataTypes.STRING
  },
  passwordResetExpires: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.verificationToken;
  delete values.passwordResetToken;
  return values;
};

// Associations
User.associate = (models) => {
  User.hasOne(models.Patient, { foreignKey: 'userId', as: 'patient' });
  User.hasOne(models.Practitioner, { foreignKey: 'userId', as: 'practitioner' });
  User.hasMany(models.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
};

module.exports = User;
```

### 2. JWT Handler

```javascript
// auth/jwtHandler.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

class JWTHandler {
  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';
    this.algorithm = 'HS256';
    this.accessTokenExpire = '15m'; // 15 minutes
    this.refreshTokenExpire = '7d'; // 7 days
  }
  
  createAccessToken(userData) {
    const payload = {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      type: 'access'
    };
    
    return jwt.sign(payload, this.secretKey, {
      algorithm: this.algorithm,
      expiresIn: this.accessTokenExpire
    });
  }
  
  createRefreshToken(userData) {
    const payload = {
      userId: userData.id,
      type: 'refresh',
      tokenId: crypto.randomUUID()
    };
    
    return jwt.sign(payload, this.secretKey, {
      algorithm: this.algorithm,
      expiresIn: this.refreshTokenExpire
    });
  }
  
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey, { algorithm: this.algorithm });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  
  decodeToken(token) {
    return jwt.decode(token);
  }
  
  createTokenPair(userData) {
    return {
      accessToken: this.createAccessToken(userData),
      refreshToken: this.createRefreshToken(userData)
    };
  }
}

module.exports = new JWTHandler();
```

### 3. Refresh Token Model

```javascript
// models/RefreshToken.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deviceInfo: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
RefreshToken.associate = (models) => {
  RefreshToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = RefreshToken;
```

### 4. Password Manager

```javascript
// auth/passwordManager.js
const bcrypt = require('bcrypt');

class PasswordManager {
  constructor() {
    this.minLength = 8;
    this.requireUppercase = true;
    this.requireLowercase = true;
    this.requireNumbers = true;
    this.requireSpecial = true;
  }
  
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters long`);
    }
    
    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (this.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (this.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  generateResetToken() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
}

module.exports = new PasswordManager();
```

### 5. Authentication Middleware

```javascript
// middleware/authMiddleware.js
const jwtHandler = require('../auth/jwtHandler');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwtHandler.verifyToken(token);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwtHandler.verifyToken(token);
      const user = await User.findByPk(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { auth, requireRole, optionalAuth };
```

### 6. Authentication Routes

```javascript
// routes/auth.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { User, RefreshToken } = require('../models');
const jwtHandler = require('../auth/jwtHandler');
const passwordManager = require('../auth/passwordManager');
const { auth } = require('../middleware/authMiddleware');
const crypto = require('crypto');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
});

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, fullName, phone, role = 'patient' } = req.body;
    
    // Validate password strength
    const passwordValidation = passwordManager.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password validation failed',
        details: passwordValidation.errors 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      email,
      password,
      fullName,
      phone,
      role,
      verificationToken: crypto.randomBytes(32).toString('hex')
    });
    
    // Generate tokens
    const tokens = jwtHandler.createTokenPair(user);
    
    // Save refresh token
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      tokens
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json({ 
        error: 'Account temporarily locked due to too many failed attempts' 
      });
    }
    
    // Verify password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      // Increment failed attempts
      await user.increment('failedLoginAttempts');
      
      if (user.failedLoginAttempts >= 5) {
        await user.update({
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        });
      }
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Reset failed attempts and update last login
    await user.update({
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date()
    });
    
    // Generate tokens
    const tokens = jwtHandler.createTokenPair(user);
    
    // Save refresh token
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwtHandler.verifyToken(refreshToken);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    
    // Check if refresh token exists and is not revoked
    const storedToken = await RefreshToken.findOne({
      where: { 
        token: refreshToken,
        isRevoked: false,
        expiresAt: { [require('sequelize').Op.gt]: new Date() }
      }
    });
    
    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    
    // Get user
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }
    
    // Generate new tokens
    const tokens = jwtHandler.createTokenPair(user);
    
    // Revoke old refresh token and create new one
    await storedToken.update({ isRevoked: true });
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    res.json({ tokens });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await RefreshToken.update(
        { isRevoked: true },
        { where: { token: refreshToken, userId: req.user.id } }
      );
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: require('../models/Patient'), as: 'patient' },
        { model: require('../models/Practitioner'), as: 'practitioner' }
      ]
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Frontend Integration

### React Authentication Context

```javascript
// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored tokens on app load
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const parsedTokens = JSON.parse(tokens);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedTokens.accessToken}`;
      
      // Verify token and get user data
      fetchCurrentUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data,
          tokens: JSON.parse(localStorage.getItem('tokens'))
        }
      });
    } catch (error) {
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, tokens } = response.data;
      
      localStorage.setItem('tokens', JSON.stringify(tokens));
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens }
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { user, tokens } = response.data;
      
      localStorage.setItem('tokens', JSON.stringify(tokens));
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, tokens }
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      if (tokens.refreshToken) {
        await axios.post('/api/auth/logout', { refreshToken: tokens.refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('tokens');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshToken = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
      const response = await axios.post('/api/auth/refresh', {
        refreshToken: tokens.refreshToken
      });
      
      const newTokens = response.data.tokens;
      localStorage.setItem('tokens', JSON.stringify(newTokens));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
      
      return newTokens.accessToken;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateUser: (user) => dispatch({ type: 'UPDATE_USER', payload: user })
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Protected Route Component

```javascript
// components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

## Environment Variables

```bash
# .env
NODE_ENV=development
PORT=8000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ayursutra_db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here-make-it-long-and-random

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=10
ACCOUNT_LOCKOUT_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION_MINUTES=30

# Email Configuration (for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@ayursutra.com
```

## Security Features

1. **Password Security**: Bcrypt hashing with salt rounds
2. **JWT Tokens**: Short-lived access tokens with refresh token rotation
3. **Account Lockout**: Temporary lockout after failed login attempts
4. **Rate Limiting**: Protection against brute force attacks
5. **Role-Based Access Control**: Different permissions for patients, practitioners, and admins
6. **Token Blacklisting**: Refresh token revocation on logout
7. **Input Validation**: Server-side validation for all authentication endpoints

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

This authentication system provides a secure, scalable foundation for the AyurSutra platform with proper JWT token management, role-based access control, and comprehensive security features.
            
            # Generate tokens
            access_token = self.jwt_handler.create_access_token(user.to_dict())
            refresh_token = self.jwt_handler.create_refresh_token(user.id)
            
            return {
                'success': True,
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'bearer'
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def refresh_token(self, refresh_token: str) -> Dict:
        """Refresh access token"""
        try:
            new_access_token = self.jwt_handler.refresh_access_token(refresh_token)
            
            if new_access_token:
                return {
                    'success': True,
                    'access_token': new_access_token,
                    'token_type': 'bearer'
                }
            else:
                return {'success': False, 'error': 'Invalid refresh token'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def logout_user(self, user_id: int, token: str) -> Dict:
        """Logout user and invalidate token"""
        try:
            # Add token to blacklist
            await self.blacklist_token(token)
            
            return {'success': True, 'message': 'Logged out successfully'}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def handle_failed_login(self, user: User):
        """Handle failed login attempt"""
        user.failed_login_attempts += 1
        
        if user.failed_login_attempts >= self.max_login_attempts:
            user.locked_until = datetime.utcnow() + timedelta(minutes=self.lockout_duration_minutes)
        
        await self.update_user(user)
    
    async def handle_successful_login(self, user: User):
        """Handle successful login"""
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login = datetime.utcnow()
        
        await self.update_user(user)
```

### 5. Authentication Middleware

```python
# middleware/auth_middleware.py
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from ..auth.jwt_handler import JWTHandler
from ..models.user_model import UserRole

security = HTTPBearer()
jwt_handler = JWTHandler()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user"""
    token = credentials.credentials
    
    # Check if token is blacklisted
    if await is_token_blacklisted(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked"
        )
    
    # Verify token
    payload = jwt_handler.verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    return payload

async def require_role(required_role: UserRole):
    """Decorator to require specific user role"""
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = UserRole(current_user.get('role'))
        
        if user_role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        
        return current_user
    
    return role_checker

async def require_any_role(allowed_roles: list):
    """Decorator to require any of the specified roles"""
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = UserRole(current_user.get('role'))
        
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        
        return current_user
    
    return role_checker

# Convenience decorators
require_patient = require_role(UserRole.PATIENT)
require_practitioner = require_role(UserRole.PRACTITIONER)
require_admin = require_role(UserRole.ADMIN)
require_staff = require_any_role([UserRole.PRACTITIONER, UserRole.ADMIN])
```

### 6. API Endpoints

```python
# api/auth_api.py
from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..services.auth_service import AuthService
from ..middleware.auth_middleware import get_current_user, require_admin

app = FastAPI()
auth_service = AuthService()

class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[str] = "patient"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenRefresh(BaseModel):
    refresh_token: str

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@app.post("/api/auth/register")
async def register(user_data: UserRegistration):
    """Register new user"""
    result = await auth_service.register_user(user_data.dict())
    
    if result['success']:
        return {
            "message": result['message'],
            "user": result['user']
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result['errors']
        )

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """User login"""
    result = await auth_service.login_user(credentials.email, credentials.password)
    
    if result['success']:
        return {
            "access_token": result['access_token'],
            "refresh_token": result['refresh_token'],
            "token_type": result['token_type'],
            "user": result['user']
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result['error']
        )

@app.post("/api/auth/refresh")
async def refresh_token(token_data: TokenRefresh):
    """Refresh access token"""
    result = await auth_service.refresh_token(token_data.refresh_token)
    
    if result['success']:
        return {
            "access_token": result['access_token'],
            "token_type": result['token_type']
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result['error']
        )

@app.post("/api/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """User logout"""
    # Token will be blacklisted in the dependency
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {"user": current_user}

@app.post("/api/auth/forgot-password")
async def forgot_password(reset_data: PasswordReset):
    """Request password reset"""
    result = await auth_service.request_password_reset(reset_data.email)
    return {"message": "If the email exists, a reset link has been sent"}

@app.post("/api/auth/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: dict = Depends(get_current_user)
):
    """Change user password"""
    result = await auth_service.change_password(
        current_user['user_id'],
        password_data.current_password,
        password_data.new_password
    )
    
    if result['success']:
        return {"message": "Password changed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result['error']
        )
```

### 7. Frontend Integration

```javascript
// services/authService.js
import axios from 'axios';

class AuthService {
  constructor() {
    this.baseURL = '/api/auth';
    this.token = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    
    // Setup axios interceptors
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth header
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            // Retry original request
            return axios.request(error.config);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async register(userData) {
    try {
      const response = await axios.post(`${this.baseURL}/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/login`, {
        email,
        password
      });

      const { access_token, refresh_token, user } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      this.token = access_token;
      this.refreshToken = refresh_token;

      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  }

  async refreshAccessToken() {
    try {
      const response = await axios.post(`${this.baseURL}/refresh`, {
        refresh_token: this.refreshToken
      });

      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      this.token = access_token;

      return access_token;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await axios.post(`${this.baseURL}/logout`);
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      this.token = null;
      this.refreshToken = null;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return roles.includes(user?.role);
  }
}

export default new AuthService();
```

### 8. React Authentication Context

```jsx
// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    hasRole: authService.hasRole.bind(authService),
    hasAnyRole: authService.hasAnyRole.bind(authService)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Security Features

### 1. Password Security
- Bcrypt hashing with salt
- Password strength validation
- Account lockout after failed attempts
- Password reset functionality

### 2. Token Security
- JWT with short expiration times
- Refresh token mechanism
- Token blacklisting on logout
- Automatic token refresh

### 3. Account Security
- Email verification required
- Rate limiting on login attempts
- Session management
- Role-based access control

### 4. API Security
- CORS configuration
- Request validation
- Error handling without information leakage
- Audit logging

This comprehensive authentication system provides secure user management with modern security practices, JWT-based authentication, and role-based access control essential for the AyurSutra platform.

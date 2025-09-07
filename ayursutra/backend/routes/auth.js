const express = require('express');
const router = express.Router();

// Mock authentication routes for development
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock user validation
  const mockUsers = {
    'doctor@ayursutra.com': { 
      id: 1, 
      role: 'practitioner', 
      name: 'Dr. Ayurveda Sharma',
      email: 'doctor@ayursutra.com'
    },
    'patient@ayursutra.com': { 
      id: 2, 
      role: 'patient', 
      name: 'Rajesh Kumar',
      email: 'patient@ayursutra.com'
    }
  };

  if (mockUsers[email] && password === 'password123') {
    const user = mockUsers[email];
    res.json({
      success: true,
      user,
      token: 'mock-jwt-token-' + user.id,
      refreshToken: 'mock-refresh-token-' + user.id
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User registered successfully',
    user: { id: Date.now(), ...req.body }
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

router.post('/refresh', (req, res) => {
  res.json({ 
    success: true, 
    token: 'new-mock-jwt-token',
    refreshToken: 'new-mock-refresh-token'
  });
});

module.exports = router;

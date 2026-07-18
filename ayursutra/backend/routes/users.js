const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authorize } = require('../middleware/auth');

router.get('/', authorize('practitioner', 'admin'), async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const users = await User.find().skip(parseInt(offset)).limit(parseInt(limit));
    res.json({ success: true, users });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

module.exports = router;

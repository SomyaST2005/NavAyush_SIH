const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, unreadOnly } = req.query;
    let query = { user: req.userId };
    if (unreadOnly === 'true') query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(offset)).limit(parseInt(limit));

    res.json({ success: true, notifications });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.userId });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, notification });
  } catch (err) { next(err); }
});

router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, notification });
  } catch (err) { next(err); }
});

router.put('/mark-all-read', async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Notification.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) { next(err); }
});

module.exports = router;

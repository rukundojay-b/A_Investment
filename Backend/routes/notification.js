const express = req
ire('express');
const router = express.Router();

// For now, just a placeholder. Later we can store notifications in DB.
let notifications = []; 

// GET notifications
router.get('/', (req, res) => {
  res.json({ success: true, notifications });
});

// POST new notification
router.post('/', (req, res) => {
  const { message, userId, type } = req.body;
  const notification = { id: Date.now(), message, userId, type, read: false, createdAt: new Date() };
  notifications.push(notification);
  res.json({ success: true, notification });
}); 

// PATCH mark as read
router.patch('/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id == req.params.id);
  if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
  notif.read = true;
  res.json({ success: true, notification: notif });
});

module.exports = router;

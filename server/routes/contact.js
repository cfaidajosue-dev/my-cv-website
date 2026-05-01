const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST save a contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: 'Message received! Thank you for reaching out.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save message.', error: err.message });
  }
});

// GET all messages (for admin view)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

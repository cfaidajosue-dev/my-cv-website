const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
require('dotenv').config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Strict email format validation
function isValidEmailFormat(email) {
  // Must have proper format: localpart@domain.tld
  // Blocks: no-dot domains, obvious fakes, too-short domains
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return false;

  const [local, domain] = email.split('@');
  if (local.length < 2) return false;
  if (!domain.includes('.')) return false;

  const tld = domain.split('.').pop();
  if (tld.length < 2) return false;

  // Block obvious placeholder/test emails
  const blocked = ['example.com', 'test.com', 'fake.com', 'placeholder.com', 'myemail.com', 'youremail.com'];
  if (blocked.some(b => domain.toLowerCase() === b)) return false;

  return true;
}

// POST save a contact message + send email notification
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ valid: false, message: 'All fields are required.' });
    }

    // Validate email format
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({
        valid: false,
        message: 'Please enter a valid, real email address.'
      });
    }

    // Save to MongoDB
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Send email notification to Josue
    const mailToJosue = {
      from: `"CV Website" <${process.env.GMAIL_USER}>`,
      to: 'cfaidajosue@gmail.com',
      subject: `📬 New message from ${name} — CV Website`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #f0f0f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #7c3aed; padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 22px;">📬 New Message on Your CV</h1>
          </div>
          <div style="padding: 28px;">
            <p style="color: #a0a0b0; margin-bottom: 20px;">Someone reached out through your CV website:</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #9d5cf6; font-weight: bold; width: 100px;">Name</td>
                <td style="padding: 10px 0; color: #f0f0f0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #9d5cf6; font-weight: bold;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #9d5cf6;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #9d5cf6; font-weight: bold; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #f0f0f0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #333;">
              <a href="mailto:${email}" style="background: #7c3aed; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reply to ${name}</a>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; color: #555; font-size: 12px; border-top: 1px solid #222;">
            Sent from your CV Website · <a href="https://github.com/cfaidajosue-dev/" style="color: #7c3aed;">GitHub</a>
          </div>
        </div>
      `
    };

    // Send auto-reply to the sender
    const mailToSender = {
      from: `"Cyiza Faida Josue" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `✅ Message received — Cyiza Faida Josue`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #f0f0f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #7c3aed; padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 22px;">Thanks for reaching out! 👋</h1>
          </div>
          <div style="padding: 28px;">
            <p style="color: #f0f0f0;">Hi <strong>${name}</strong>,</p>
            <p style="color: #a0a0b0; line-height: 1.7;">Thank you for your message! I've received it and will get back to you as soon as possible.</p>
            <div style="background: #1a1a2e; border-left: 3px solid #7c3aed; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
              <p style="color: #a0a0b0; margin: 0; font-style: italic;">"${message}"</p>
            </div>
            <p style="color: #a0a0b0;">In the meantime, feel free to check out my work:</p>
            <div style="display: flex; gap: 12px; margin-top: 16px;">
              <a href="https://github.com/cfaidajosue-dev/" style="background: #7c3aed; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 10px;">GitHub</a>
              <a href="https://www.instagram.com/josh_fame2" style="background: #e1306c; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Instagram</a>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; color: #555; font-size: 12px; border-top: 1px solid #222;">
            Cyiza Faida Josue · cfaidajosue@gmail.com
          </div>
        </div>
      `
    };

    // Send both emails (don't block response if email fails)
    transporter.sendMail(mailToJosue).catch(err => console.error('Email to Josue failed:', err.message));
    transporter.sendMail(mailToSender).catch(err => console.error('Auto-reply failed:', err.message));

    res.status(201).json({ message: 'Message received! Thank you for reaching out.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save message.', error: err.message });
  }
});

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

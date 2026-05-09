const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const seedProfile = require('../seed');

// GET profile data
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST create or update profile (seed)
router.post('/seed', async (req, res) => {
  try {
    await seedProfile();
    const profile = await Profile.findOne();
    res.json({ message: 'Profile seeded successfully', profile });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

module.exports = router;

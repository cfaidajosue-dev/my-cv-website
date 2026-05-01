require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Serve the frontend static files
app.use(express.static(path.join(__dirname, '..')));

// ===== ROUTES =====
app.use('/api/profile', require('./routes/profile'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/chat', require('./routes/chat'));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');

    // Auto-seed profile if empty
    const Profile = require('./models/Profile');
    const count = await Profile.countDocuments();
    if (count === 0) {
      console.log('📦 No profile found — seeding default data...');
      const seedProfile = require('./seed');
      await seedProfile();
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📋 API endpoints:`);
      console.log(`   GET  /api/profile       — CV data`);
      console.log(`   POST /api/profile/seed  — Seed profile data`);
      console.log(`   POST /api/contact       — Submit contact form`);
      console.log(`   GET  /api/contact       — View all messages`);
      console.log(`   POST /api/chat          — Chat with AI`);
      console.log(`   GET  /api/chat/:id      — Get chat history`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

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
    await Profile.deleteMany();
    const profile = new Profile({
      name: 'Cyiza Faida Josue',
      title: 'Software Development Student',
      about: 'Hi! I\'m Cyiza Faida Josue, a passionate high school student in S5 studying Software Development. I love turning ideas into reality through code and I\'m always eager to learn new technologies and improve my skills.',
      email: 'cfaidajosue@gmail.com',
      location: 'Rwanda',
      github: '',
      linkedin: '',
      skills: [
        { name: 'HTML', category: 'Frontend', level: 80 },
        { name: 'CSS', category: 'Frontend', level: 75 },
        { name: 'JavaScript', category: 'Frontend', level: 65 },
        { name: 'Python', category: 'Programming', level: 70 },
        { name: 'SQL / Databases', category: 'Backend', level: 60 },
        { name: 'Git', category: 'Tools', level: 55 }
      ],
      education: [
        {
          level: 'S5 — Current',
          field: 'Software Development',
          school: 'High School',
          status: 'In Progress',
          description: 'Studying core software development concepts including programming, web development, databases, and software engineering principles.'
        },
        {
          level: 'S4 — Completed',
          field: 'Software Development',
          school: 'High School',
          status: 'Completed',
          description: 'Completed foundational courses in programming and computer science fundamentals.'
        }
      ],
      projects: [
        {
          title: 'Personal CV Website',
          description: 'A responsive personal portfolio website built with HTML, CSS, and JavaScript to showcase my skills and projects.',
          tags: ['HTML', 'CSS', 'JavaScript'],
          link: ''
        },
        {
          title: 'School Project',
          description: 'A software development project built as part of my S5 curriculum, applying programming concepts learned in class.',
          tags: ['Python', 'Logic'],
          link: ''
        }
      ]
    });
    await profile.save();
    res.json({ message: 'Profile seeded successfully', profile });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

module.exports = router;

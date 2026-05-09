const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String },
  github: { type: String },
  linkedin: { type: String },
  skills: [
    {
      name: { type: String },
      category: { type: String },
      level: { type: Number, min: 0, max: 100 }
    }
  ],
  education: [
    {
      level: { type: String },
      field: { type: String },
      school: { type: String },
      status: { type: String },
      description: { type: String }
    }
  ],
  projects: [
    {
      title: { type: String },
      description: { type: String },
      tags: [String],
      link: { type: String }
    }
  ],
  interests: [
    {
      category: { type: String },
      items: [String]
    }
  ],
  family: [
    {
      name: { type: String },
      relationship: { type: String },
      description: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);

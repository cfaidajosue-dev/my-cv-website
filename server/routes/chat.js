const express = require('express');
const router = express.Router();
const https = require('https');
const ChatHistory = require('../models/ChatHistory');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a friendly AI assistant on the personal CV website of Cyiza Faida Josue.
Your job is to answer questions about Josue based on the following information:

NAME: Cyiza Faida Josue
EDUCATION: Currently in S5 (Senior 5) at high school, studying Software Development in Rwanda.
SKILLS: HTML, CSS, JavaScript, Python, basic SQL/Databases, Git (version control)
PASSION: He is passionate about coding and building software that solves real problems.
EMAIL: cfaidajosue@gmail.com
PROJECTS: Personal CV website (HTML, CSS, JS), school software development projects.
GOAL: To become a skilled software developer.
LOCATION: Currently living at Shyorongi Sector, Rwanda. Born in Kigali.
EMPLOYMENT: Not yet employed, currently a student.
HOBBIES: Loves playing football. It is his favourite way to unwind and he enjoys the teamwork and energy the game brings.

Rules:
- Only answer questions related to Josue or his work/skills/personal life.
- If asked something unrelated, politely say you can only answer questions about Josue.
- Keep answers short, friendly, and helpful.
- If asked for contact info, provide his email: cfaidajosue@gmail.com`;

// POST send a chat message
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ message: 'message and sessionId are required.' });
    }

    // Load or create session history
    let session = await ChatHistory.findOne({ sessionId });
    if (!session) {
      session = new ChatHistory({ sessionId, messages: [] });
    }

    // Add user message to history
    session.messages.push({ role: 'user', content: message });

    // Build messages array for Groq
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...session.messages.map(m => ({ role: m.role, content: m.content }))
    ];

    // Call Groq API
    const groqResponse = await callGroq(groqMessages);

    // Save assistant reply to history
    session.messages.push({ role: 'assistant', content: groqResponse });
    await session.save();

    res.json({ reply: groqResponse, sessionId });
  } catch (err) {
    res.status(500).json({ message: 'Chat error', error: err.message });
  }
});

// GET chat history for a session
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await ChatHistory.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.json({ messages: [] });
    res.json({ messages: session.messages });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

function callGroq(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 300
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error('No response from Groq: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = router;

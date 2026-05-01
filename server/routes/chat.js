const express = require('express');
const router = express.Router();
const https = require('https');
const ChatHistory = require('../models/ChatHistory');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const JOSUE_INFO = `
NAME: Cyiza Faida Josue
EDUCATION: Currently in S5 (Senior 5) at high school, studying Software Development in Rwanda.
SKILLS: HTML, CSS, JavaScript, Python, basic SQL/Databases, Git (version control)
PASSION: He is passionate about coding and building software that solves real problems.
EMAIL: cfaidajosue@gmail.com
GITHUB: https://github.com/cfaidajosue-dev/
INSTAGRAM: @josh_fame2
PROJECTS: Personal CV website (HTML, CSS, JS), school software development projects.
GOAL: To become a skilled software developer.
LOCATION: Currently living at Shyorongi Sector, Rwanda. Born in Kigali.
EMPLOYMENT: Not yet employed, currently a student.
HOBBIES: Loves playing football. It is his favourite way to unwind and he enjoys the teamwork and energy the game brings.
`;

const SYSTEM_PROMPTS = {
  en: `You are a friendly AI assistant on the personal CV website of Cyiza Faida Josue.
Your job is to answer questions about Josue based on the following information:
${JOSUE_INFO}
Rules:
- ALWAYS respond in English.
- Only answer questions related to Josue or his work/skills/personal life.
- If asked something unrelated, politely say you can only answer questions about Josue.
- Keep answers short, friendly, and helpful.
- If asked for contact info, provide his email: cfaidajosue@gmail.com`,

  fr: `Tu es un assistant IA sympathique sur le site CV personnel de Cyiza Faida Josue.
Ton rôle est de répondre aux questions sur Josue en te basant sur les informations suivantes:
${JOSUE_INFO}
Règles:
- TOUJOURS répondre en français.
- Ne réponds qu'aux questions liées à Josue, son travail, ses compétences ou sa vie personnelle.
- Si on te pose une question sans rapport, dis poliment que tu ne peux répondre qu'aux questions sur Josue.
- Garde les réponses courtes, amicales et utiles.
- Pour les coordonnées, fournis son email: cfaidajosue@gmail.com`,

  rw: `Uri umufasha wa AI uturanye ku rubuga rwa CV rwa Cyiza Faida Josue.
Akazi kawe ni gusubiza ibibazo ku byerekeye Josue hashingiwe ku makuru akurikira:
${JOSUE_INFO}
Amategeko:
- BURI GIHE subiza mu Kinyarwanda.
- Subiza gusa ibibazo bijyanye na Josue, akazi ke, ubushobozi bwe cyangwa ubuzima bwe bwite.
- Niba habajijwe ikintu kitajyanye, sema neza ko ushobora gusa gusubiza ibibazo ku byerekeye Josue.
- Subiza mu magambo make, mu buryo bwiza kandi bifasha.
- Niba babajije uburyo bwo kumubonana, tanga imeli ye: cfaidajosue@gmail.com`
};

// POST send a chat message
router.post('/', async (req, res) => {
  try {
    const { message, sessionId, lang = 'en' } = req.body;

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

    // Pick system prompt based on language
    const systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.en;

    // Build messages array for Groq
    const groqMessages = [
      { role: 'system', content: systemPrompt },
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

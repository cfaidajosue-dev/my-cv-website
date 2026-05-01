// ===== CHATBOT (via backend) =====
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// Generate a unique session ID per browser tab
const sessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now();

const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose  = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput  = document.getElementById('chatInput');
const chatSend   = document.getElementById('chatSend');

// Get current language (set by i18n.js)
function getCurrentLang() {
  return localStorage.getItem('lang') || 'en';
}

// Error messages per language
const chatErrors = {
  en: {
    trouble: 'Sorry, I had trouble responding. Please try again.',
    offline: 'Could not reach the server. Make sure the backend is running.'
  },
  fr: {
    trouble: 'Désolé, j\'ai eu du mal à répondre. Veuillez réessayer.',
    offline: 'Impossible de joindre le serveur. Assurez-vous que le backend fonctionne.'
  },
  rw: {
    trouble: 'Mbabarira, nagize ikibazo cyo gusubiza. Ongera ugerageze.',
    offline: 'Ntishobora kugera kuri seriveri. Reba niba backend irimo gukora.'
  }
};

// Toggle chat window
chatBubble.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  chatBubble.classList.toggle('active');
  if (chatWindow.classList.contains('open')) chatInput.focus();
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.remove('open');
  chatBubble.classList.remove('active');
});

// Send on Enter key
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

chatSend.addEventListener('click', sendMessage);

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.classList.add('chat-msg', role);
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendTypingIndicator() {
  const div = document.createElement('div');
  div.classList.add('chat-msg', 'bot', 'typing-indicator');
  div.innerHTML = `<div class="msg-bubble"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function sendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = '';
  chatSend.disabled = true;

  appendMessage('user', userText);
  const typingEl = appendTypingIndicator();

  const lang = getCurrentLang();
  const errors = chatErrors[lang] || chatErrors.en;

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, sessionId, lang })
    });

    const data = await response.json();
    typingEl.remove();

    if (data.reply) {
      appendMessage('bot', data.reply);
    } else {
      appendMessage('bot', errors.trouble);
    }
  } catch (error) {
    typingEl.remove();
    appendMessage('bot', errors.offline);
    console.error('Chat error:', error);
  }

  chatSend.disabled = false;
  chatInput.focus();
}

// Called by i18n.js when language changes — update welcome msg & placeholder
window.updateChatLanguage = function(lang) {
  const welcomeEl = document.getElementById('chatWelcomeMsg');
  const welcomeMessages = {
    en: "Hi! 👋 I'm Josue's AI assistant. Ask me anything about him — his skills, education, projects, or how to contact him!",
    fr: "Salut! 👋 Je suis l'assistant IA de Josue. Posez-moi n'importe quelle question sur lui — ses compétences, sa formation, ses projets ou comment le contacter!",
    rw: "Muraho! 👋 Ndi umufasha wa AI wa Josue. Mbaza ikibazo cyose kubyerekeye — ubushobozi bwe, amashuri, imishinga, cyangwa uburyo bwo kumubonana!"
  };
  const placeholders = {
    en: 'Ask something about Josue...',
    fr: 'Posez une question sur Josue...',
    rw: 'Baza ikibazo ku byerekeye Josue...'
  };

  if (welcomeEl) {
    welcomeEl.querySelector('.msg-bubble').textContent = welcomeMessages[lang] || welcomeMessages.en;
  }
  chatInput.placeholder = placeholders[lang] || placeholders.en;
};

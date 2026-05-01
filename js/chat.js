// ===== CHATBOT (via backend) =====
const API_BASE = 'http://localhost:3000/api';

// Generate a unique session ID per browser tab
const sessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now();

const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// Toggle chat window
chatBubble.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  chatBubble.classList.toggle('active');
  if (chatWindow.classList.contains('open')) {
    chatInput.focus();
  }
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

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, sessionId })
    });

    const data = await response.json();
    typingEl.remove();

    if (data.reply) {
      appendMessage('bot', data.reply);
    } else {
      appendMessage('bot', 'Sorry, I had trouble responding. Please try again.');
    }
  } catch (error) {
    typingEl.remove();
    appendMessage('bot', 'Could not reach the server. Make sure the backend is running.');
    console.error('Chat error:', error);
  }

  chatSend.disabled = false;
  chatInput.focus();
}

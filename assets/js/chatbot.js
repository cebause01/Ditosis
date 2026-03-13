// ══════════════════════════════════════════════════════
// DITOSIS CHATBOT — Powered by Groq
// ══════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", function () {

  // ── 1. Inject HTML if not already in page ────────────
  if (!document.getElementById('chat-toggle')) {
    document.body.insertAdjacentHTML('beforeend', `
      <button class="chat-toggle" id="chat-toggle" aria-label="Open chat">
        <svg class="chat-icon-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <svg class="chat-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        <span class="chat-unread" id="chat-unread">1</span>
      </button>

      <div class="chat-window" id="chat-window" aria-hidden="true">
        <div class="chat-header">
          <div class="chat-header-left">
            <div class="chat-avatar">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <defs><linearGradient id="cgAv" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00F5A0"/><stop offset="100%" stop-color="#00D9F5"/>
                </linearGradient></defs>
                <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24" stroke="url(#cgAv)" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="16" cy="16" r="4" fill="url(#cgAv)"/>
                <circle cx="16" cy="8"  r="2" fill="url(#cgAv)"/>
                <circle cx="16" cy="24" r="2" fill="url(#cgAv)"/>
              </svg>
            </div>
            <div class="chat-header-info">
              <span class="chat-name">Diddy Ditosis Assistant</span>
              <span class="chat-status"><span class="chat-status-dot"></span>Online</span>
            </div>
          </div>
          <div class="chat-header-actions">
            <button class="chat-clear-btn" id="chat-clear" title="Clear chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
            <button class="chat-close-btn" id="chat-close" aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="chat-messages" id="chat-messages"></div>

        <div class="chat-suggestions" id="chat-suggestions">
          <button class="chat-suggestion">What is synthetic data?</button>
          <button class="chat-suggestion">What data types do you offer?</button>
          <button class="chat-suggestion">How does pricing work?</button>
          <button class="chat-suggestion">How do I get started?</button>
        </div>

        <div class="chat-input-area">
          <div class="chat-input-row">
            <textarea class="chat-input" id="chat-input" placeholder="Ask about our data solutions..." rows="1" aria-label="Chat message"></textarea>
            <button class="chat-send-btn" id="chat-send" aria-label="Send" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p class="chat-footer-note">Ditosis AI Assistant · <a href="/index.html#request">Talk to a human</a></p>
        </div>
      </div>
    `);
  }

  // ── 2. System prompt ──────────────────────────────────
  const SYSTEM_PROMPT = `You are a helpful and friendly customer support assistant for Ditosis, a premium AI data company. Your name is "Diddy Ditosis Assistant".

Always answer ONLY about Ditosis and its services. If asked anything unrelated, politely redirect the conversation back to Ditosis.

Keep answers clear and concise — 2 to 5 sentences. Use simple language.

== ABOUT DITOSIS ==
Ditosis is an enterprise-grade AI data company that provides three core services:

1. REAL DATA
   - 1,200+ curated, ethically-sourced real-world datasets
   - 8.4 billion+ data points across 94 languages
   - Fully compliant: GDPR, HIPAA, CCPA
   - Cleaned, annotated, and ready to use

2. SYNTHETIC DATA GENERATION
   - Generate unlimited synthetic data: text, image, audio, video, tabular, multimodal
   - Zero privacy risk — no real user data involved
   - Production-ready in hours, not months
   - Indistinguishable from real data distributions

3. AI MODEL TRAINING
   - Fine-tuning, RLHF, DPO, full custom pre-training
   - 94% domain accuracy across industries
   - SOC 2 compliant, enterprise-grade infrastructure
   - Supports healthcare, finance, automotive, retail and more

== PRICING & CONTACT ==
- Pricing: custom quotes based on volume and requirements
- Free consultation available
- Contact: hello@ditosis.com
- To request data or get started: use the request form on the website

== RULES ==
- Never invent prices, timelines, or features not listed above
- If someone wants to speak to a human, direct them to hello@ditosis.com or the request form
- Always be warm, professional, and helpful
- If unsure about something, say so honestly and suggest contacting the team`;

  // ── 3. State ──────────────────────────────────────────
  let messages  = [];
  let isLoading = false;

  // ── 4. DOM refs ───────────────────────────────────────
  const toggleBtn  = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn   = document.getElementById('chat-close');
  const clearBtn   = document.getElementById('chat-clear');
  const messagesEl = document.getElementById('chat-messages');
  const inputEl    = document.getElementById('chat-input');
  const sendBtn    = document.getElementById('chat-send');
  const suggestEl  = document.getElementById('chat-suggestions');
  const unreadBadge = document.getElementById('chat-unread');
  const openIcon   = toggleBtn.querySelector('.chat-icon-open');
  const closeIcon  = toggleBtn.querySelector('.chat-icon-close');

  // ── 5. Helpers ────────────────────────────────────────
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function formatReply(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  function addMessage(role, text) {
    const isBot = role === 'bot';
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg ' + (isBot ? 'bot' : 'user');

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    if (isBot) {
      avatar.innerHTML = `<svg width="14" height="14" viewBox="0 0 32 32" fill="none">
        <defs><linearGradient id="cgA2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00F5A0"/><stop offset="100%" stop-color="#00D9F5"/>
        </linearGradient></defs>
        <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24" stroke="url(#cgA2)" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="16" cy="16" r="4" fill="url(#cgA2)"/>
      </svg>`;
    } else {
      avatar.textContent = 'You';
    }

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    if (isBot) {
      bubble.innerHTML = '<p>' + formatReply(text) + '</p>';
    } else {
      bubble.textContent = text;
    }

    const ts = document.createElement('span');
    ts.className = 'chat-timestamp';
    ts.textContent = getTime();

    const inner = document.createElement('div');
    inner.style.cssText = 'display:flex;flex-direction:column;max-width:82%';
    inner.appendChild(bubble);
    inner.appendChild(ts);

    wrapper.appendChild(avatar);
    wrapper.appendChild(inner);
    messagesEl.appendChild(wrapper);
    scrollToBottom();
  }

  function showTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg bot';
    wrapper.id = 'chat-typing-indicator';
    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.innerHTML = `<svg width="14" height="14" viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="cgA3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00F5A0"/><stop offset="100%" stop-color="#00D9F5"/>
      </linearGradient></defs>
      <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16C24 20.42 20.42 24 16 24" stroke="url(#cgA3)" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="16" cy="16" r="4" fill="url(#cgA3)"/>
    </svg>`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  // ── 6. Open / Close ───────────────────────────────────
  function openChat() {
    chatWindow.classList.add('open');
    chatWindow.setAttribute('aria-hidden', 'false');
    openIcon.style.display = 'none';
    closeIcon.style.display = 'block';
    unreadBadge.classList.add('hidden');
    inputEl.focus();
  }

  function closeChat() {
    chatWindow.classList.remove('open');
    chatWindow.setAttribute('aria-hidden', 'true');
    openIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }

  toggleBtn.addEventListener('click', () =>
    chatWindow.classList.contains('open') ? closeChat() : openChat()
  );
  closeBtn.addEventListener('click', closeChat);

  // ── 7. Clear chat ─────────────────────────────────────
  clearBtn.addEventListener('click', () => {
    messages = [];
    messagesEl.innerHTML = '';
    suggestEl.classList.remove('hidden');
    addMessage('bot', 'Chat cleared! How can I help you with Ditosis today?');
  });

  // ── 8. Send message ───────────────────────────────────
  async function sendMessage(text) {
    text = text.trim();
    if (!text || isLoading) return;

    isLoading = true;
    sendBtn.disabled = true;
    suggestEl.classList.add('hidden');

    messages.push({ role: 'user', content: text });
    addMessage('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    showTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      removeTyping();

      const reply = data.content?.[0]?.text
        || "I'm sorry, I couldn't generate a response. Please try again.";

      messages.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);

    } catch (err) {
      removeTyping();
      console.error('Chatbot error:', err.message);

      let errorMsg = "Sorry, I'm having trouble connecting right now.";
      if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        errorMsg = "⚠️ Can't reach the server. Make sure you're on http://localhost:3000 and node server.js is running.";
      } else if (err.message.includes('Ollama')) {
        errorMsg = "⚠️ Ollama isn't running. Open a terminal and run: ollama serve";
      }
      errorMsg += " For urgent help email hello@ditosis.com";
      addMessage('bot', errorMsg);
    }

    isLoading = false;
    sendBtn.disabled = inputEl.value.trim().length === 0;
  }

  // ── 9. Input events ───────────────────────────────────
  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  inputEl.addEventListener('input', () => {
    sendBtn.disabled = inputEl.value.trim().length === 0;
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  // ── 10. Suggestion chips ──────────────────────────────
  suggestEl.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });

  // ── 11. Welcome message ───────────────────────────────
  setTimeout(() => {
    addMessage('bot', "👋 Hi! I'm Diddy, the Ditosis Assistant. I can help you with questions about our real data, synthetic data generation, and AI model training services.\n\nWhat can I help you with today?");
  }, 700);

});
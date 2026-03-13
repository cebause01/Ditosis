// ================================================
// Ditosis Chatbot Server — powered by Groq
//
// Setup:
//   1. Get free API key: https://console.groq.com
//   2. Paste your key in the .env file
//   3. npm install
//   4. node server.js
//   5. Open http://localhost:3000
// ================================================

import express from 'express';
import cors from 'cors';
import { readFileSync, existsSync } from 'fs';
import { Groq } from 'groq-sdk';

// ── Load .env file manually (no extra package needed) ──
if (existsSync('.env')) {
  const lines = readFileSync('.env', 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim();
    if (key && value) {
      process.env[key.trim()] = value;
    }
  }
  console.log('✅ Loaded .env file');
} else {
  console.warn('⚠️  No .env file found — create one with GROQ_API_KEY=your_key');
}

const app  = express();
const PORT = 3000;

// ── Init Groq client ──────────────────────────
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ── Health check ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', provider: 'groq', model: 'qwen/qwen3-32b' });
});

// ── Chat endpoint ─────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { system, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const groqMessages = [
      { role: 'system', content: system || '' },
      ...messages
    ];

    const stream = await groq.chat.completions.create({
      model: 'qwen/qwen3-32b',
      messages: groqMessages,
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: true,
      reasoning_effort: 'default',
      stop: null
    });

    let fullReply = '';
    for await (const chunk of stream) {
      fullReply += chunk.choices[0]?.delta?.content || '';
    }

    fullReply = fullReply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    res.json({ content: [{ type: 'text', text: fullReply }] });

  } catch (err) {
    console.error('Groq error:', err.message);
    if (err.status === 401) return res.status(401).json({ error: 'Invalid API key. Check your .env file.' });
    if (err.status === 429) return res.status(429).json({ error: 'Rate limit hit. Please wait and try again.' });
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log(`║  Ditosis chatbot  →  http://localhost:${PORT}    ║`);
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  Provider : Groq                             ║');
  console.log('║  Model    : qwen/qwen3-32b              ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('\n  API key:', process.env.GROQ_API_KEY ? '✅ Found' : '❌ Missing — edit .env file');
  console.log('  Get free key: https://console.groq.com\n');
});
// api/groq.js
// A minimal, stateless proxy. Groq's API blocks direct browser calls (CORS),
// same as OpenAI/Anthropic — this function exists purely to satisfy that,
// by making the request server-side instead of from the browser.
// It does not log, store, or forward your key anywhere except straight to Groq.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed' } });
    return;
  }

  const { apiKey, model, messages, max_tokens, temperature } = req.body || {};
  if (!apiKey) {
    res.status(400).json({ error: { message: 'Missing apiKey in request body' } });
    return;
  }
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: { message: 'Missing or invalid messages array' } });
    return;
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-oss-120b',
        messages,
        max_tokens: max_tokens || 400,
        temperature: temperature ?? 0.5,
      }),
    });
    const data = await groqRes.json();
    res.status(groqRes.status).json(data);
  } catch (err) {
    res.status(502).json({ error: { message: 'Could not reach Groq: ' + (err.message || 'unknown error') } });
  }
}

// Thin client for the OpenRouter chat completions API.
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export async function chatCompletion({ apiKey, model, models, messages, temperature = 0.8 }) {
  if (!apiKey) {
    throw new Error('Missing OpenRouter API key.');
  }

  const body = { messages, temperature };
  if (models && models.length) {
    body.model = models[0];
    body.models = models;
    body.route = 'fallback';
  } else {
    body.model = model;
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': typeof location !== 'undefined' ? location.href : 'https://survive-the-z.local',
      'X-Title': 'Survive The Z',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const errJson = await res.json();
      detail = (errJson && errJson.error && errJson.error.message) || JSON.stringify(errJson);
    } catch {
      detail = await res.text();
    }
    throw new Error(`OpenRouter ${res.status}: ${detail}`);
  }

  return res.json();
}

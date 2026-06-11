// Narrative generation client.
//
// Today this resolves narrative text from local templates (prompt/templates.js)
// so the game runs fully offline with no external dependencies. The AI_CONFIG
// below is a placeholder seam: set `enabled: true` and provide an `endpoint`
// (and `apiKey` if required) to route narrative generation through a live
// LLM API instead. The calling code (core/*) does not need to change.
import { pickVariant } from '../prompt/templates.js';

const AI_CONFIG = {
  enabled: false,
  endpoint: null,
  apiKey: null,
};

export async function generateNarrative(templateName, context = {}) {
  if (AI_CONFIG.enabled && AI_CONFIG.endpoint) {
    try {
      return await fetchFromAi(templateName, context);
    } catch (err) {
      console.warn('AI narration request failed, falling back to local text:', err);
    }
  }
  return pickVariant(templateName, context);
}

async function fetchFromAi(templateName, context) {
  const headers = { 'Content-Type': 'application/json' };
  if (AI_CONFIG.apiKey) {
    headers.Authorization = `Bearer ${AI_CONFIG.apiKey}`;
  }
  const response = await fetch(AI_CONFIG.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ template: templateName, context }),
  });
  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }
  const data = await response.json();
  return data.text || pickVariant(templateName, context);
}

// Configuration for OpenRouter-backed AI Game Master models.
// Pricing is in USD per 1 million tokens, based on OpenRouter listings.
export const MODELS = [
  { id: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', pricing: { prompt: 0.05, completion: 0.30 } },
  { id: 'moonshotai/kimi-k2', name: 'Kimi K2', pricing: { prompt: 0.55, completion: 2.20 } },
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B Instruct', pricing: { prompt: 0.35, completion: 0.40 } },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o mini', pricing: { prompt: 0.15, completion: 0.60 } },
  { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek V3', pricing: { prompt: 0.27, completion: 1.10 } },
];

// Free-tier OpenRouter models used for auto fallback routing ($0 cost).
// Each of these has a real ":free" model slug on OpenRouter; the client
// requests them in order with route: 'fallback' so if one is rate-limited
// or unavailable, the next is tried automatically.
export const FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'google/gemini-2.0-flash-exp:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
];

export function getModel(modelId) {
  return MODELS.find((m) => m.id === modelId);
}

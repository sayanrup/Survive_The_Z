// Tracks token usage and estimated USD cost for AI Game Master requests.
import { MODELS } from './modelConfig.js';

export function getModelPricing(modelId) {
  const model = MODELS.find((m) => m.id === modelId);
  if (model) return model.pricing;
  if (modelId && modelId.endsWith(':free')) return { prompt: 0, completion: 0 };
  return null;
}

export function recordUsage(state, modelId, usage) {
  state.ai.usage = state.ai.usage || { promptTokens: 0, completionTokens: 0, costUsd: 0 };

  const promptTokens = usage.prompt_tokens || 0;
  const completionTokens = usage.completion_tokens || 0;
  state.ai.usage.promptTokens += promptTokens;
  state.ai.usage.completionTokens += completionTokens;

  const pricing = getModelPricing(modelId);
  if (pricing) {
    const cost = (promptTokens / 1e6) * pricing.prompt + (completionTokens / 1e6) * pricing.completion;
    state.ai.usage.costUsd += cost;
  }
}

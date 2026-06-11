// Orchestrates AI Game Master turns: builds the prompt, calls OpenRouter,
// parses the response, and applies the resulting changes to game state.
import { chatCompletion } from '../api/openRouterClient.js';
import { recordUsage } from '../api/costTracker.js';
import { buildSystemPrompt, buildStateMessage } from '../prompt/genesisPrompt.js';
import { FREE_MODELS } from '../api/modelConfig.js';
import { AI_MODES } from '../state/aiSettings.js';
import { addLog, addItem, removeItem, modifyStat, grantXp, checkGameOver } from '../state/gameState.js';
import { LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';

const HISTORY_LIMIT = 24;

export async function sendPlayerAction(state, aiSettings, actionText) {
  const trimmed = (actionText || '').trim();
  if (!trimmed) {
    throw new Error('Type an action first.');
  }
  if (!aiSettings.apiKey) {
    throw new Error('Add your OpenRouter API key in the AI Game Master settings first.');
  }
  if (aiSettings.mode === AI_MODES.CUSTOM && !aiSettings.customModel.trim()) {
    throw new Error('Enter a custom OpenRouter model ID first.');
  }

  state.ai = state.ai || { history: [], usage: { promptTokens: 0, completionTokens: 0, costUsd: 0 } };

  const userMessage = buildStateMessage(state) + trimmed;
  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    ...state.ai.history,
    { role: 'user', content: userMessage },
  ];

  const requestOpts = { apiKey: aiSettings.apiKey, messages };
  if (aiSettings.mode === AI_MODES.FREE_AUTO) {
    requestOpts.models = FREE_MODELS;
  } else if (aiSettings.mode === AI_MODES.CUSTOM) {
    requestOpts.model = aiSettings.customModel.trim();
  } else {
    requestOpts.model = aiSettings.model;
  }

  const response = await chatCompletion(requestOpts);
  const choice = response.choices && response.choices[0];
  const content = (choice && choice.message && choice.message.content) || '';
  const usedModel = response.model || requestOpts.model;

  if (response.usage) {
    recordUsage(state, usedModel, response.usage);
  }

  const parsed = parseAiResponse(content);

  state.ai.history.push({ role: 'user', content: userMessage });
  state.ai.history.push({ role: 'assistant', content });
  if (state.ai.history.length > HISTORY_LIMIT) {
    state.ai.history.splice(0, state.ai.history.length - HISTORY_LIMIT);
  }

  addLog(state, `> ${trimmed}`);
  applyAiChanges(state, parsed);

  return parsed;
}

export function parseAiResponse(content) {
  if (!content) return { narrative: '' };
  let jsonText = content.trim();

  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  }

  try {
    return JSON.parse(jsonText);
  } catch {
    const braceMatch = content.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch {
        // fall through to plain narrative
      }
    }
    return { narrative: content.trim() };
  }
}

export function applyAiChanges(state, changes) {
  if (!changes || typeof changes !== 'object') return;

  if (changes.narrative) {
    addLog(state, changes.narrative);
  }

  if (changes.stat_changes && typeof changes.stat_changes === 'object') {
    for (const [stat, amount] of Object.entries(changes.stat_changes)) {
      if (typeof amount === 'number' && amount !== 0 && state.player[stat] !== undefined) {
        modifyStat(state, stat, amount);
      }
    }
  }

  if (Array.isArray(changes.items_gained)) {
    for (const entry of changes.items_gained) {
      if (entry && ITEMS[entry.id] && entry.qty > 0) {
        addItem(state, entry.id, entry.qty);
        addLog(state, `You gained ${entry.qty}x ${ITEMS[entry.id].name}.`);
      }
    }
  }

  if (Array.isArray(changes.items_lost)) {
    for (const entry of changes.items_lost) {
      if (entry && ITEMS[entry.id] && entry.qty > 0) {
        const removed = removeItem(state, entry.id, entry.qty);
        if (removed) {
          addLog(state, `You lost ${entry.qty}x ${ITEMS[entry.id].name}.`);
        }
      }
    }
  }

  if (changes.location && LOCATIONS[changes.location]) {
    const current = LOCATIONS[state.world.currentLocation];
    if (current.connections.includes(changes.location)) {
      state.world.currentLocation = changes.location;
      addLog(state, `You are now at ${LOCATIONS[changes.location].name}.`);
    }
  }

  if (typeof changes.xp_gained === 'number' && changes.xp_gained > 0) {
    grantXp(state, changes.xp_gained);
  }

  checkGameOver(state);
}

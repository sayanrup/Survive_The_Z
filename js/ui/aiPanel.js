// Renders the AI Game Master settings, usage tracker, free-text command
// form, and save export/import controls.
import { MODELS, FREE_MODELS } from '../api/modelConfig.js';
import { AI_MODES } from '../state/aiSettings.js';

export function renderAiPanel(state, aiSettings) {
  const usage = (state.ai && state.ai.usage) || { promptTokens: 0, completionTokens: 0, costUsd: 0 };

  const modeOptions = [
    { value: AI_MODES.CLASSIC, label: 'Classic (offline, no AI)' },
    { value: AI_MODES.SELECTED, label: 'Pick a model (OpenRouter)' },
    { value: AI_MODES.CUSTOM, label: 'Custom model / BYOK' },
    { value: AI_MODES.FREE_AUTO, label: 'Free OpenRouter models (auto)' },
  ];

  const modeSelect = `
    <select id="ai-mode">
      ${modeOptions
        .map((opt) => `<option value="${opt.value}" ${aiSettings.mode === opt.value ? 'selected' : ''}>${opt.label}</option>`)
        .join('')}
    </select>
  `;

  const needsApiKey = aiSettings.mode !== AI_MODES.CLASSIC;
  const apiKeyField = needsApiKey
    ? `
    <label for="ai-api-key">OpenRouter API key</label>
    <input type="password" id="ai-api-key" placeholder="sk-or-..." value="${escapeAttr(aiSettings.apiKey)}" autocomplete="off" />
  `
    : '';

  let modelField = '';
  if (aiSettings.mode === AI_MODES.SELECTED) {
    modelField = `
      <label for="ai-model">Model</label>
      <select id="ai-model">
        ${MODELS.map(
          (m) =>
            `<option value="${m.id}" ${aiSettings.model === m.id ? 'selected' : ''}>${m.name} ($${m.pricing.prompt.toFixed(2)} / $${m.pricing.completion.toFixed(2)} per M tok)</option>`
        ).join('')}
      </select>
    `;
  } else if (aiSettings.mode === AI_MODES.CUSTOM) {
    modelField = `
      <label for="ai-custom-model">OpenRouter model ID</label>
      <input type="text" id="ai-custom-model" placeholder="e.g. anthropic/claude-3.5-haiku" value="${escapeAttr(aiSettings.customModel)}" />
    `;
  } else if (aiSettings.mode === AI_MODES.FREE_AUTO) {
    modelField = `
      <p class="hint">Routes across ${FREE_MODELS.length} free OpenRouter models with automatic fallback. $0 cost, but may be rate-limited or unavailable at times.</p>
    `;
  }

  const usageDisplay = needsApiKey
    ? `
    <div class="ai-usage">
      <span>Tokens used: ${usage.promptTokens + usage.completionTokens} (in ${usage.promptTokens} / out ${usage.completionTokens})</span>
      <span>Estimated cost: $${usage.costUsd.toFixed(4)}</span>
    </div>
  `
    : '';

  const commandForm = needsApiKey
    ? `
    <form id="ai-command-form" class="ai-command-form">
      <input type="text" id="ai-command-input" placeholder="What do you do? e.g. 'Search the kitchen for food'" autocomplete="off" ${state.gameOver ? 'disabled' : ''} />
      <button type="submit" ${state.gameOver ? 'disabled' : ''}>Do</button>
    </form>
    <p class="hint">The AI Game Master narrates the outcome and may change your stats, inventory, or location.</p>
  `
    : `<p class="hint">Switch to an AI mode above to type free-text actions and let the AI Game Master narrate outcomes.</p>`;

  return `
    <h3>AI Game Master</h3>
    <div class="ai-settings">
      <label for="ai-mode">Mode</label>
      ${modeSelect}
      ${apiKeyField}
      ${modelField}
    </div>
    ${usageDisplay}
    ${commandForm}
    <div class="ai-savetools">
      <button type="button" data-action="export-save">Export Save</button>
      <label class="file-label">
        Import Save
        <input type="file" id="import-save-input" accept="application/json" />
      </label>
    </div>
  `;
}

function escapeAttr(value) {
  return String(value || '').replace(/"/g, '&quot;');
}

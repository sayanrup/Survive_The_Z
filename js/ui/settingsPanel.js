// Renders the Settings tab: AI Game Master configuration, usage tracker,
// save/load/reset/exit controls, and save export/import.
import { renderAiSettingsFields } from './aiPanel.js';
import { AI_MODES } from '../state/aiSettings.js';

export function renderSettings(state, aiSettings) {
  const usage = (state.ai && state.ai.usage) || { promptTokens: 0, completionTokens: 0, costUsd: 0 };
  const needsApiKey = aiSettings.mode !== AI_MODES.CLASSIC;

  const usageDisplay = needsApiKey
    ? `
    <div class="ai-usage">
      <span>Tokens used: ${usage.promptTokens + usage.completionTokens} (in ${usage.promptTokens} / out ${usage.completionTokens})</span>
      <span>Estimated cost: $${usage.costUsd.toFixed(4)}</span>
    </div>
  `
    : '';

  return `
    <h3>AI Game Master</h3>
    <div class="ai-settings">
      ${renderAiSettingsFields(aiSettings)}
    </div>
    ${usageDisplay}

    <h3>Game</h3>
    <div class="settings-actions">
      <button type="button" data-action="save-game">Save</button>
      <button type="button" data-action="load-game">Load</button>
      <button type="button" data-action="reset-game">Reset</button>
      <button type="button" data-action="exit-game">Exit</button>
    </div>

    <h3>Save File</h3>
    <div class="ai-savetools">
      <button type="button" data-action="export-save">Export Save</button>
      <label class="file-label">
        Import Save
        <input type="file" id="import-save-input" accept="application/json" />
      </label>
    </div>
  `;
}

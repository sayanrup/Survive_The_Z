// Top-level render coordinator: refreshes each tab's panels from current state.
import { renderStats } from './statsPanel.js';
import { renderActions } from './actionsPanel.js';
import { renderInventory } from './inventoryPanel.js';
import { renderLog } from './logPanel.js';
import { renderAiCommandForm } from './aiPanel.js';
import { renderPeople } from './peoplePanel.js';
import { renderEvents } from './eventsPanel.js';
import { renderSettings } from './settingsPanel.js';

export function renderGame(state, aiSettings) {
  document.getElementById('stats-panel').innerHTML = renderStats(state);
  document.getElementById('day-counter').textContent = `Day ${state.world.day}`;

  document.getElementById('suggestions-panel').innerHTML = renderActions(state);
  document.getElementById('inventory-panel').innerHTML = state.gameOver ? '' : renderInventory(state);

  const logEl = document.getElementById('log-panel');
  logEl.innerHTML = renderLog(state);
  logEl.scrollTop = logEl.scrollHeight;

  document.getElementById('ai-command-panel').innerHTML = renderAiCommandForm(state, aiSettings);
  document.getElementById('people-panel').innerHTML = renderPeople(state);
  document.getElementById('events-panel').innerHTML = renderEvents(state);
  document.getElementById('settings-panel').innerHTML = renderSettings(state, aiSettings);
}

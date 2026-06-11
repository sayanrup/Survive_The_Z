// Top-level render coordinator: refreshes each tab's panels from current state.
import { renderStats } from './statsPanel.js';
import { renderLocation } from './locationPanel.js';
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

  if (state.gameOver) {
    document.getElementById('location-panel').innerHTML = '';
    document.getElementById('action-panel').innerHTML = renderActions(state);
    document.getElementById('inventory-panel').innerHTML = '';
  } else {
    document.getElementById('location-panel').innerHTML = renderLocation(state);
    document.getElementById('action-panel').innerHTML = renderActions(state);
    document.getElementById('inventory-panel').innerHTML = renderInventory(state);
  }

  document.getElementById('log-panel').innerHTML = renderLog(state);
  document.getElementById('ai-command-panel').innerHTML = renderAiCommandForm(state, aiSettings);
  document.getElementById('people-panel').innerHTML = renderPeople(state);
  document.getElementById('events-panel').innerHTML = renderEvents(state);
  document.getElementById('settings-panel').innerHTML = renderSettings(state, aiSettings);
}

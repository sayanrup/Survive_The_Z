// Top-level render coordinator: refreshes each panel from current state.
import { renderStats } from './statsPanel.js';
import { renderLocation } from './locationPanel.js';
import { renderActions } from './actionsPanel.js';
import { renderInventory } from './inventoryPanel.js';
import { renderLog } from './logPanel.js';

export function renderGame(state) {
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
}

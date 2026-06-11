// Renders the contextual action panel: exploration choices, combat choices,
// or the game-over message.
import { LOCATIONS } from '../data/locations.js';

export function renderActions(state) {
  if (state.gameOver) {
    return `
      <h3>The End</h3>
      <p>${state.player.name} did not survive the outbreak.</p>
      <button data-action="restart">Start a New Game</button>
    `;
  }
  if (state.combat) {
    return renderCombatActions(state);
  }
  return renderExplorationActions(state);
}

function renderExplorationActions(state) {
  const loc = LOCATIONS[state.world.currentLocation];
  const travelBtns = loc.connections
    .map((id) => {
      const dest = LOCATIONS[id];
      return `<button data-action="travel" data-target="${id}">Travel to ${dest.name}</button>`;
    })
    .join('');

  const otherBtns = [];
  if (!loc.safe) {
    otherBtns.push('<button data-action="scavenge">Scavenge</button>');
  } else {
    otherBtns.push('<button data-action="rest">Rest until morning</button>');
  }

  return `
    <h3>Actions</h3>
    <div class="action-group">${travelBtns}</div>
    <div class="action-group">${otherBtns.join('')}</div>
  `;
}

function renderCombatActions(state) {
  const c = state.combat;
  const pct = Math.max(0, Math.min(100, (c.health / c.maxHealth) * 100));
  return `
    <h3>Combat: ${c.enemyName}</h3>
    <div class="stat-row">
      <span class="stat-label">${c.enemyName}</span>
      <div class="stat-bar"><div class="stat-fill health" style="width:${pct}%"></div></div>
      <span class="stat-value">${c.health}/${c.maxHealth}</span>
    </div>
    <div class="action-group">
      <button data-action="attack">Attack</button>
      <button data-action="flee">Flee</button>
    </div>
    <p class="hint">Use a food, drink, or medical item from your inventory to heal mid-fight.</p>
  `;
}

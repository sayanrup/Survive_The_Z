// Renders contextual actions as suggestion chips near the chat box:
// exploration choices, combat choices, or the game-over message.
import { LOCATIONS } from '../data/locations.js';

export function renderActions(state) {
  if (state.gameOver) {
    return `
      <div class="game-over-banner">
        <h3>The End</h3>
        <p>${state.player.name} did not survive the outbreak.</p>
        <button data-action="restart">Start a New Game</button>
      </div>
    `;
  }
  if (state.combat) {
    return renderCombatActions(state);
  }
  return renderExplorationActions(state);
}

function renderExplorationActions(state) {
  const loc = LOCATIONS[state.world.currentLocation];
  const chips = loc.connections.map((id) => {
    const dest = LOCATIONS[id];
    return `<button class="chip" data-action="travel" data-target="${id}">Travel to ${dest.name}</button>`;
  });

  if (!loc.safe) {
    chips.push('<button class="chip" data-action="scavenge">Scavenge</button>');
  } else {
    chips.push('<button class="chip" data-action="rest">Rest until morning</button>');
  }

  return `
    <div class="suggestions-label">Suggested actions</div>
    <div class="chip-row">${chips.join('')}</div>
  `;
}

function renderCombatActions(state) {
  const c = state.combat;
  const pct = Math.max(0, Math.min(100, (c.health / c.maxHealth) * 100));
  return `
    <div class="combat-status">
      <span class="stat-label">${c.enemyName}</span>
      <div class="stat-bar"><div class="stat-fill health" style="width:${pct}%"></div></div>
      <span class="stat-value">${c.health}/${c.maxHealth}</span>
    </div>
    <div class="suggestions-label">Suggested actions</div>
    <div class="chip-row">
      <button class="chip chip-danger" data-action="attack">Attack</button>
      <button class="chip" data-action="flee">Flee</button>
    </div>
    <p class="hint">Use a food, drink, or medical item from your Inventory tab to heal mid-fight.</p>
  `;
}

// Renders the player stats panel (health/hunger/thirst/stamina, level, gear).
import { ITEMS } from '../data/items.js';
import { LOCATIONS } from '../data/locations.js';

function bar(label, value, max, cls) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-bar"><div class="stat-fill ${cls}" style="width:${pct}%"></div></div>
      <span class="stat-value">${Math.round(value)}/${max}</span>
    </div>`;
}

export function renderStats(state) {
  const p = state.player;
  const weapon = p.equippedWeapon ? ITEMS[p.equippedWeapon].name : 'None';
  const armor = p.equippedArmor ? ITEMS[p.equippedArmor].name : 'None';
  const scenario = state.scenario;
  const scenarioInfo = scenario
    ? `<div class="equip-info"><div><span class="equip-label">Storyline:</span> ${scenario.icon || ''} ${scenario.title}</div></div>`
    : '';
  const loc = LOCATIONS[state.world.currentLocation];
  const locTag = loc.safe
    ? '<span class="tag tag-safe">Safe</span>'
    : `<span class="tag tag-danger">Danger ${loc.danger}</span>`;
  return `
    <h2>${p.name}</h2>
    <div class="level-info">Level ${p.level} &middot; XP ${p.xp}/${p.xpToNext}</div>
    ${bar('Health', p.health, p.maxHealth, 'health')}
    ${bar('Hunger', p.hunger, p.maxHunger, 'hunger')}
    ${bar('Thirst', p.thirst, p.maxThirst, 'thirst')}
    ${bar('Stamina', p.stamina, p.maxStamina, 'stamina')}
    <div class="equip-info">
      <div><span class="equip-label">Location:</span> ${loc.name} ${locTag}</div>
      <div><span class="equip-label">Weapon:</span> ${weapon}</div>
      <div><span class="equip-label">Armor:</span> ${armor}</div>
    </div>
    ${scenarioInfo}
  `;
}

// Travel and scavenging: moving the world forward and triggering encounters.
import { LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { getRandomEvent } from '../data/events.js';
import { addLog, modifyStat, addItem, checkGameOver } from '../state/gameState.js';
import { applyCost, advanceTurn, TRAVEL_COST_TABLE, SCAVENGE_COST_TABLE } from './survival.js';
import { startCombat } from './combat.js';
import { generateNarrative } from '../api/aiClient.js';

function randomInRange([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(entries) {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1];
}

export async function travel(state, destinationId) {
  const current = LOCATIONS[state.world.currentLocation];
  const destination = LOCATIONS[destinationId];
  if (!destination || !current.connections.includes(destinationId)) {
    addLog(state, "You can't travel there from here.");
    return;
  }

  applyCost(state, TRAVEL_COST_TABLE);
  advanceTurn(state);
  if (state.gameOver) return;

  state.world.currentLocation = destinationId;
  const arriveText = await generateNarrative('travelArrive', { locationName: destination.name, scenario: state.scenario });
  addLog(state, arriveText);

  if (destination.safe) {
    return;
  }

  await rollEncounter(state, destination);
}

export async function scavenge(state) {
  const location = LOCATIONS[state.world.currentLocation];
  if (location.safe) {
    addLog(state, 'There is nothing to scavenge here.');
    return;
  }

  applyCost(state, SCAVENGE_COST_TABLE);
  advanceTurn(state);
  if (state.gameOver) return;

  const found = await rollLoot(state, location);
  if (!found) {
    const text = await generateNarrative('scavengeNothing', { scenario: state.scenario });
    addLog(state, text);
  }

  await rollEncounter(state, location);
}

async function rollLoot(state, location) {
  if (!location.loot || location.loot.length === 0) return false;
  let foundAny = false;
  for (const drop of location.loot) {
    if (Math.random() < drop.chance) {
      const qty = randomInRange(drop.qty);
      addItem(state, drop.id, qty);
      foundAny = true;
      const itemName = `${qty}x ${ITEMS[drop.id].name}`;
      const text = await generateNarrative('scavengeFound', { itemName, scenario: state.scenario });
      addLog(state, text);
    }
  }
  return foundAny;
}

async function rollEncounter(state, location) {
  if (state.combat) return;
  const encounterChance = 0.3 + location.danger * 0.08;
  if (Math.random() >= encounterChance) {
    return;
  }

  if (location.enemies && location.enemies.length > 0 && Math.random() < 0.75) {
    const choice = pickWeighted(location.enemies);
    await startCombat(state, choice.id);
  } else {
    const event = getRandomEvent();
    addLog(state, event.text);
    if (event.effect) {
      for (const [stat, amount] of Object.entries(event.effect)) {
        if (stat === 'bonusLoot') {
          await rollLoot(state, location);
          continue;
        }
        modifyStat(state, stat, amount);
      }
      checkGameOver(state);
    }
  }
}

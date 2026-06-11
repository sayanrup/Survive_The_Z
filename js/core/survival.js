// Survival mechanics: hunger/thirst decay, resting, and starvation damage.
import { modifyStat, addLog, checkGameOver } from '../state/gameState.js';
import { generateNarrative } from '../api/aiClient.js';

const TRAVEL_COST = { stamina: -15, hunger: -8, thirst: -10 };
const SCAVENGE_COST = { stamina: -10, hunger: -5, thirst: -6 };
const STARVATION_DAMAGE = 5;

export function applyCost(state, cost) {
  for (const [stat, amount] of Object.entries(cost)) {
    modifyStat(state, stat, amount);
  }
  applyStarvation(state);
}

export function applyStarvation(state) {
  const player = state.player;
  if (player.hunger <= 0 || player.thirst <= 0) {
    modifyStat(state, 'health', -STARVATION_DAMAGE);
    if (player.hunger <= 0 && player.thirst <= 0) {
      addLog(state, 'You are starving and dehydrated. Your health is failing.');
    } else if (player.hunger <= 0) {
      addLog(state, 'You are starving. Your health is failing.');
    } else {
      addLog(state, 'You are dehydrated. Your health is failing.');
    }
    checkGameOver(state);
  }
}

export const TRAVEL_COST_TABLE = TRAVEL_COST;
export const SCAVENGE_COST_TABLE = SCAVENGE_COST;

export async function restAtCamp(state) {
  const player = state.player;
  player.stamina = player.maxStamina;
  modifyStat(state, 'health', 20);
  modifyStat(state, 'hunger', -15);
  modifyStat(state, 'thirst', -15);
  state.world.day += 1;
  state.world.turn = 0;
  const text = await generateNarrative('restAtCamp', { scenario: state.scenario });
  addLog(state, text);
  applyStarvation(state);
}

export function advanceTurn(state) {
  state.world.turn += 1;
  if (state.world.turn >= 6) {
    state.world.turn = 0;
    state.world.day += 1;
    addLog(state, `Day ${state.world.day} begins.`);
  }
}

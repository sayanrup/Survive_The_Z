// Using consumable items outside of combat.
import { ITEMS } from '../data/items.js';
import { removeItem, modifyStat, addLog } from '../state/gameState.js';

export function useItem(state, itemId) {
  const item = ITEMS[itemId];
  if (!item) return;
  if (item.type !== 'food' && item.type !== 'drink' && item.type !== 'medical') {
    addLog(state, `You can't use the ${item.name} right now.`);
    return;
  }
  if (!removeItem(state, itemId, 1)) {
    addLog(state, `You don't have any ${item.name}.`);
    return;
  }
  if (item.health) modifyStat(state, 'health', item.health);
  if (item.hunger) modifyStat(state, 'hunger', item.hunger);
  if (item.thirst) modifyStat(state, 'thirst', item.thirst);
  addLog(state, `You use the ${item.name}.`);
}

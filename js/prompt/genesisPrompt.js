// Builds the prompts sent to the AI Game Master (via OpenRouter).
import { ITEMS } from '../data/items.js';
import { LOCATIONS } from '../data/locations.js';

export function buildSystemPrompt() {
  const itemIds = Object.keys(ITEMS).join(', ');
  const locationIds = Object.values(LOCATIONS)
    .map((loc) => `${loc.id} (${loc.name})`)
    .join(', ');

  return `You are the Game Master for "Survive The Z", a turn-based, text-driven zombie survival RPG. The player describes an action in plain English and you narrate the outcome, then report any mechanical effects.

Valid item IDs (only use these): ${itemIds}
Valid location IDs (only use these, and only if connected to the player's current location): ${locationIds}

Respond with ONLY a single JSON object, no markdown fences and no extra commentary outside the JSON, using exactly this shape:
{
  "narrative": "1-3 sentences of vivid second-person narration describing what happens",
  "stat_changes": { "health": 0, "hunger": 0, "thirst": 0, "stamina": 0 },
  "items_gained": [{"id": "item_id", "qty": 1}],
  "items_lost": [{"id": "item_id", "qty": 1}],
  "location": null,
  "xp_gained": 0
}

Rules:
- Only reference item IDs and location IDs from the lists above.
- "location" must be the new location ID if (and only if) the action moves the player there, otherwise null. Only allow moves to locations connected to the player's current location.
- stat_changes are deltas (positive or negative), typically between -20 and 20, reflecting the risk/reward of the action.
- items_lost should only include items the player currently has, in quantities they currently hold.
- xp_gained should be 0 for routine actions and a small positive number (5-20) for meaningful achievements (finding rare loot, surviving danger, completing something notable).
- Keep the tone tense and grounded in a post-outbreak setting, written in second person ("you").
- Omit fields you don't need, or set arrays to [] and numbers to 0.`;
}

export function buildStateMessage(state) {
  const loc = LOCATIONS[state.world.currentLocation];
  const inventory = state.player.inventory
    .map((entry) => `${ITEMS[entry.id] ? ITEMS[entry.id].name : entry.id} x${entry.qty}`)
    .join(', ') || 'empty';

  return `Current state:
Day: ${state.world.day}
Location: ${loc.id} (${loc.name}) - connections: ${loc.connections.join(', ')}
Health: ${state.player.health}/${state.player.maxHealth}
Hunger: ${state.player.hunger}/${state.player.maxHunger}
Thirst: ${state.player.thirst}/${state.player.maxThirst}
Stamina: ${state.player.stamina}/${state.player.maxStamina}
Level: ${state.player.level} (XP ${state.player.xp}/${state.player.xpToNext})
Equipped weapon: ${state.player.equippedWeapon || 'none'}
Equipped armor: ${state.player.equippedArmor || 'none'}
Inventory: ${inventory}

Player action: `;
}

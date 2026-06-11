// Central game state shape and helper mutators shared across core/ui modules.
export const STAT_MAX = 100;

export function createNewGame(playerName) {
  return {
    player: {
      name: playerName || 'Survivor',
      level: 1,
      xp: 0,
      xpToNext: 50,
      health: 100,
      maxHealth: 100,
      hunger: 100,
      maxHunger: 100,
      thirst: 100,
      maxThirst: 100,
      stamina: 100,
      maxStamina: 100,
      inventory: [
        { id: 'canned_food', qty: 2 },
        { id: 'water_bottle', qty: 2 },
        { id: 'bandage', qty: 1 },
        { id: 'knife', qty: 1 },
      ],
      equippedWeapon: 'knife',
      equippedArmor: null,
    },
    world: {
      day: 1,
      turn: 0,
      currentLocation: 'camp',
    },
    combat: null,
    log: [],
    gameOver: false,
    victoryPending: false,
  };
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function addLog(state, message) {
  state.log.push(message);
  if (state.log.length > 50) {
    state.log.shift();
  }
}

export function modifyStat(state, stat, amount) {
  const player = state.player;
  const maxKey = 'max' + stat.charAt(0).toUpperCase() + stat.slice(1);
  const max = player[maxKey] !== undefined ? player[maxKey] : STAT_MAX;
  player[stat] = clamp(player[stat] + amount, 0, max);
}

export function addItem(state, itemId, qty = 1) {
  const inv = state.player.inventory;
  const existing = inv.find((entry) => entry.id === itemId);
  if (existing) {
    existing.qty += qty;
  } else {
    inv.push({ id: itemId, qty });
  }
}

export function removeItem(state, itemId, qty = 1) {
  const inv = state.player.inventory;
  const existing = inv.find((entry) => entry.id === itemId);
  if (!existing || existing.qty < qty) {
    return false;
  }
  existing.qty -= qty;
  if (existing.qty <= 0) {
    state.player.inventory = inv.filter((entry) => entry.id !== itemId);
  }
  return true;
}

export function getItemCount(state, itemId) {
  const entry = state.player.inventory.find((e) => e.id === itemId);
  return entry ? entry.qty : 0;
}

export function grantXp(state, amount) {
  const player = state.player;
  player.xp += amount;
  addLog(state, `You gained ${amount} XP.`);
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level += 1;
    player.maxHealth += 10;
    player.maxStamina += 5;
    player.health = player.maxHealth;
    player.stamina = player.maxStamina;
    player.xpToNext = Math.round(player.xpToNext * 1.5);
    addLog(state, `You leveled up! You are now level ${player.level}.`);
  }
}

export function checkGameOver(state) {
  if (state.player.health <= 0) {
    state.player.health = 0;
    state.gameOver = true;
    addLog(state, 'Your vision fades to black. You did not survive.');
  }
}

// Turn-based combat resolution.
import { ENEMIES } from '../data/enemies.js';
import { ITEMS } from '../data/items.js';
import {
  modifyStat,
  addLog,
  addItem,
  removeItem,
  getItemCount,
  grantXp,
  checkGameOver,
} from '../state/gameState.js';
import { generateNarrative } from '../api/aiClient.js';

function randomInRange([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function startCombat(state, enemyId) {
  const template = ENEMIES[enemyId];
  state.combat = {
    enemyId,
    enemyName: template.name,
    health: template.health,
    maxHealth: template.health,
    attack: template.attack,
    defense: template.defense,
    xp: template.xp,
    loot: template.loot,
  };
  const text = await generateNarrative('combatStart', { enemyName: template.name });
  addLog(state, text);
}

function getEquippedWeapon(state) {
  const weaponId = state.player.equippedWeapon;
  return weaponId ? ITEMS[weaponId] : null;
}

function getEquippedArmorDefense(state) {
  const armorId = state.player.equippedArmor;
  if (!armorId) return 0;
  const armor = ITEMS[armorId];
  return armor ? armor.defense || 0 : 0;
}

export async function playerAttack(state) {
  const combat = state.combat;
  if (!combat) return;
  const weapon = getEquippedWeapon(state);

  if (weapon && weapon.ammoType) {
    if (getItemCount(state, weapon.ammoType) <= 0) {
      addLog(state, `You're out of ammo for the ${weapon.name}!`);
      return;
    }
    removeItem(state, weapon.ammoType, 1);
  }

  const baseDamage = weapon ? randomInRange(weapon.damage) : randomInRange([1, 3]);
  const levelBonus = Math.floor(state.player.level / 2);
  const damage = Math.max(1, baseDamage + levelBonus - combat.defense);
  combat.health = Math.max(0, combat.health - damage);
  addLog(state, `You hit the ${combat.enemyName} for ${damage} damage.`);

  if (weapon && weapon.consumable) {
    removeItem(state, weapon.id, 1);
    if (getItemCount(state, weapon.id) <= 0 && state.player.equippedWeapon === weapon.id) {
      state.player.equippedWeapon = 'knife';
      addLog(state, `Your ${weapon.name} is spent. You switch back to your ${ITEMS.knife.name}.`);
    }
  }

  if (combat.health <= 0) {
    await resolveVictory(state);
    return;
  }

  await enemyAttack(state);
}

export async function enemyAttack(state) {
  const combat = state.combat;
  if (!combat) return;
  const armorDefense = getEquippedArmorDefense(state);
  const baseDamage = randomInRange(combat.attack);
  const damage = Math.max(1, baseDamage - armorDefense);
  modifyStat(state, 'health', -damage);
  addLog(state, `The ${combat.enemyName} hits you for ${damage} damage.`);
  checkGameOver(state);
}

export async function useItemInCombat(state, itemId) {
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
  addLog(state, `You use ${item.name}.`);

  await enemyAttack(state);
}

export async function attemptFlee(state) {
  const combat = state.combat;
  if (!combat) return;
  const fleeChance = 0.4 + state.player.stamina / 250; // 0.4 - 0.8
  modifyStat(state, 'stamina', -10);
  if (Math.random() < fleeChance) {
    const text = await generateNarrative('combatFleeSuccess', { enemyName: combat.enemyName });
    addLog(state, text);
    state.combat = null;
  } else {
    const text = await generateNarrative('combatFleeFail', { enemyName: combat.enemyName });
    addLog(state, text);
    await enemyAttack(state);
  }
}

async function resolveVictory(state) {
  const combat = state.combat;
  const text = await generateNarrative('combatVictory', { enemyName: combat.enemyName });
  addLog(state, text);
  grantXp(state, combat.xp);

  for (const drop of combat.loot || []) {
    if (Math.random() < drop.chance) {
      const qty = randomInRange(drop.qty);
      addItem(state, drop.id, qty);
      addLog(state, `You find ${qty}x ${ITEMS[drop.id].name}.`);
    }
  }

  state.combat = null;
}

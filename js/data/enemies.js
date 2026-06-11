// Enemy definitions used by combat encounters.
export const ENEMIES = {
  walker: {
    id: 'walker',
    name: 'Walker',
    health: 20,
    attack: [2, 5],
    defense: 0,
    xp: 10,
    loot: [
      { id: 'cloth', qty: [1, 2], chance: 0.4 },
      { id: 'canned_food', qty: [1, 1], chance: 0.15 },
    ],
  },
  feral_dog: {
    id: 'feral_dog',
    name: 'Feral Dog',
    health: 18,
    attack: [3, 7],
    defense: 0,
    xp: 12,
    loot: [
      { id: 'cloth', qty: [1, 1], chance: 0.3 },
    ],
  },
  runner: {
    id: 'runner',
    name: 'Runner',
    health: 30,
    attack: [4, 8],
    defense: 1,
    xp: 18,
    loot: [
      { id: 'metal_scrap', qty: [1, 2], chance: 0.35 },
      { id: 'ammo_9mm', qty: [1, 3], chance: 0.2 },
    ],
  },
  bloater: {
    id: 'bloater',
    name: 'Bloater',
    health: 45,
    attack: [5, 10],
    defense: 2,
    xp: 30,
    loot: [
      { id: 'fuel_canister', qty: [1, 1], chance: 0.25 },
      { id: 'first_aid_kit', qty: [1, 1], chance: 0.1 },
    ],
  },
  brute: {
    id: 'brute',
    name: 'Brute',
    health: 70,
    attack: [8, 15],
    defense: 4,
    xp: 50,
    loot: [
      { id: 'riot_armor', qty: [1, 1], chance: 0.15 },
      { id: 'metal_scrap', qty: [2, 4], chance: 0.4 },
    ],
  },
  horde: {
    id: 'horde',
    name: 'Shambling Horde',
    health: 100,
    attack: [10, 18],
    defense: 3,
    xp: 80,
    loot: [
      { id: 'first_aid_kit', qty: [1, 1], chance: 0.2 },
      { id: 'machete', qty: [1, 1], chance: 0.1 },
    ],
  },
};

export function getEnemy(enemyId) {
  return ENEMIES[enemyId];
}

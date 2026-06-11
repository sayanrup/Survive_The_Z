// World map: a graph of locations the player can travel between.
export const LOCATIONS = {
  camp: {
    id: 'camp',
    name: 'Survivor Camp',
    description: 'A fortified camp. Safe to rest and regroup here.',
    danger: 0,
    safe: true,
    connections: ['suburbs', 'forest'],
    loot: [],
    enemies: [],
  },
  suburbs: {
    id: 'suburbs',
    name: 'Abandoned Suburbs',
    description: 'Rows of empty houses, doors hanging open. Something moves between them.',
    danger: 1,
    safe: false,
    connections: ['camp', 'town', 'gas_station'],
    loot: [
      { id: 'canned_food', qty: [1, 2], chance: 0.4 },
      { id: 'cloth', qty: [1, 3], chance: 0.5 },
      { id: 'water_bottle', qty: [1, 1], chance: 0.3 },
    ],
    enemies: [
      { id: 'walker', weight: 6 },
      { id: 'feral_dog', weight: 3 },
    ],
  },
  forest: {
    id: 'forest',
    name: 'Dense Forest',
    description: 'Thick trees block the light. The undergrowth hides movement.',
    danger: 2,
    safe: false,
    connections: ['camp', 'hospital'],
    loot: [
      { id: 'energy_bar', qty: [1, 2], chance: 0.4 },
      { id: 'wood_plank', qty: [1, 2], chance: 0.3 },
      { id: 'cloth', qty: [1, 2], chance: 0.3 },
    ],
    enemies: [
      { id: 'walker', weight: 4 },
      { id: 'feral_dog', weight: 4 },
      { id: 'runner', weight: 2 },
    ],
  },
  gas_station: {
    id: 'gas_station',
    name: 'Derelict Gas Station',
    description: 'Rusted pumps and a half-collapsed convenience store.',
    danger: 2,
    safe: false,
    connections: ['suburbs'],
    loot: [
      { id: 'fuel_canister', qty: [1, 1], chance: 0.4 },
      { id: 'energy_bar', qty: [1, 2], chance: 0.4 },
      { id: 'duct_tape', qty: [1, 1], chance: 0.3 },
    ],
    enemies: [
      { id: 'walker', weight: 5 },
      { id: 'runner', weight: 4 },
    ],
  },
  town: {
    id: 'town',
    name: 'Town Center',
    description: 'The heart of what used to be a small town. Heavily infested.',
    danger: 3,
    safe: false,
    connections: ['suburbs', 'warehouse'],
    loot: [
      { id: 'ammo_9mm', qty: [1, 4], chance: 0.3 },
      { id: 'metal_scrap', qty: [1, 3], chance: 0.4 },
      { id: 'bandage', qty: [1, 1], chance: 0.3 },
    ],
    enemies: [
      { id: 'runner', weight: 5 },
      { id: 'bloater', weight: 3 },
      { id: 'walker', weight: 4 },
    ],
  },
  hospital: {
    id: 'hospital',
    name: 'Ruined Hospital',
    description: 'Sterile corridors gone dark. Medical supplies, if you can reach them.',
    danger: 3,
    safe: false,
    connections: ['forest'],
    loot: [
      { id: 'first_aid_kit', qty: [1, 1], chance: 0.35 },
      { id: 'bandage', qty: [1, 2], chance: 0.5 },
      { id: 'duct_tape', qty: [1, 1], chance: 0.3 },
    ],
    enemies: [
      { id: 'runner', weight: 4 },
      { id: 'bloater', weight: 4 },
      { id: 'walker', weight: 2 },
    ],
  },
  warehouse: {
    id: 'warehouse',
    name: 'Industrial Warehouse',
    description: 'Towering shelves and shipping crates. The most dangerous place you know of.',
    danger: 4,
    safe: false,
    connections: ['town'],
    loot: [
      { id: 'machete', qty: [1, 1], chance: 0.15 },
      { id: 'riot_armor', qty: [1, 1], chance: 0.1 },
      { id: 'metal_scrap', qty: [2, 4], chance: 0.5 },
      { id: 'ammo_9mm', qty: [2, 5], chance: 0.4 },
    ],
    enemies: [
      { id: 'brute', weight: 3 },
      { id: 'runner', weight: 4 },
      { id: 'horde', weight: 1 },
    ],
  },
};

export function getLocation(locationId) {
  return LOCATIONS[locationId];
}

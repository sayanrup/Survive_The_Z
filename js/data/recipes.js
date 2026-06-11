// Crafting recipes: combine materials into useful items.
export const RECIPES = [
  {
    id: 'craft_bandage',
    name: 'Makeshift Bandage',
    description: 'Wrap cloth scraps into a usable bandage.',
    requires: [{ id: 'cloth', qty: 2 }],
    result: { id: 'bandage', qty: 1 },
  },
  {
    id: 'craft_spiked_bat',
    name: 'Spiked Bat',
    description: 'Reinforce a bat with metal scrap.',
    requires: [
      { id: 'bat', qty: 1 },
      { id: 'metal_scrap', qty: 2 },
    ],
    result: { id: 'spiked_bat', qty: 1 },
  },
  {
    id: 'craft_molotov',
    name: 'Molotov Cocktail',
    description: 'Combine fuel and cloth into a thrown weapon.',
    requires: [
      { id: 'cloth', qty: 1 },
      { id: 'fuel_canister', qty: 1 },
    ],
    result: { id: 'molotov', qty: 1 },
  },
  {
    id: 'craft_first_aid_kit',
    name: 'First Aid Kit',
    description: 'Assemble bandages and tape into a proper medical kit.',
    requires: [
      { id: 'bandage', qty: 2 },
      { id: 'duct_tape', qty: 1 },
    ],
    result: { id: 'first_aid_kit', qty: 1 },
  },
];

export function getRecipe(recipeId) {
  return RECIPES.find((r) => r.id === recipeId);
}

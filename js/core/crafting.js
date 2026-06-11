// Crafting: combine inventory materials into new items via recipes.
import { RECIPES } from '../data/recipes.js';
import { ITEMS } from '../data/items.js';
import { addItem, removeItem, getItemCount, addLog } from '../state/gameState.js';

export function getAvailableRecipes(state) {
  return RECIPES.map((recipe) => ({
    ...recipe,
    canCraft: recipe.requires.every((req) => getItemCount(state, req.id) >= req.qty),
  }));
}

export function craftItem(state, recipeId) {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return false;

  const canCraft = recipe.requires.every((req) => getItemCount(state, req.id) >= req.qty);
  if (!canCraft) {
    addLog(state, `You don't have the materials to craft ${recipe.name}.`);
    return false;
  }

  for (const req of recipe.requires) {
    removeItem(state, req.id, req.qty);
  }
  addItem(state, recipe.result.id, recipe.result.qty);
  addLog(state, `You craft ${recipe.result.qty}x ${ITEMS[recipe.result.id].name}.`);
  return true;
}

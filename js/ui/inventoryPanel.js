// Renders the inventory list and crafting panel.
import { ITEMS } from '../data/items.js';
import { getAvailableRecipes } from '../core/crafting.js';

export function renderInventory(state) {
  const inv = state.player.inventory;
  const itemsHtml = inv.length === 0
    ? '<li class="empty">Your pockets are empty.</li>'
    : inv.map((entry) => renderItemRow(state, entry)).join('');

  const craftingHtml = state.combat ? '' : renderCrafting(state);

  return `
    <h3>Inventory</h3>
    <ul class="inventory-list">${itemsHtml}</ul>
    ${craftingHtml}
  `;
}

function renderItemRow(state, entry) {
  const item = ITEMS[entry.id];
  const actions = [];

  if (item.type === 'food' || item.type === 'drink' || item.type === 'medical') {
    const action = state.combat ? 'use-item-combat' : 'use-item';
    actions.push(`<button data-action="${action}" data-item="${item.id}">Use</button>`);
  }

  if (item.type === 'weapon' && !state.combat) {
    const isEquipped = state.player.equippedWeapon === item.id;
    actions.push(
      `<button data-action="equip-weapon" data-item="${item.id}" ${isEquipped ? 'disabled' : ''}>${isEquipped ? 'Equipped' : 'Equip'}</button>`
    );
  }

  if (item.type === 'armor' && !state.combat) {
    const isEquipped = state.player.equippedArmor === item.id;
    actions.push(
      `<button data-action="equip-armor" data-item="${item.id}" ${isEquipped ? 'disabled' : ''}>${isEquipped ? 'Equipped' : 'Equip'}</button>`
    );
  }

  return `
    <li class="inventory-item">
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-qty">x${entry.qty}</span>
      </div>
      <div class="item-desc">${item.description}</div>
      ${actions.length ? `<div class="item-actions">${actions.join('')}</div>` : ''}
    </li>
  `;
}

function renderCrafting(state) {
  const recipes = getAvailableRecipes(state);
  const recipeHtml = recipes
    .map((r) => {
      const reqText = r.requires.map((req) => `${req.qty}x ${ITEMS[req.id].name}`).join(', ');
      return `
        <li class="recipe-item ${r.canCraft ? '' : 'unavailable'}">
          <div class="item-info">
            <span class="item-name">${r.name}</span>
          </div>
          <div class="item-desc">Requires: ${reqText}</div>
          <button data-action="craft" data-recipe="${r.id}" ${r.canCraft ? '' : 'disabled'}>Craft</button>
        </li>
      `;
    })
    .join('');

  return `
    <h3>Crafting</h3>
    <ul class="recipe-list">${recipeHtml}</ul>
  `;
}

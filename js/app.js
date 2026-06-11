// Application entry point: wires up the start screen, the main game loop
// (via event delegation), and persistence.
import { createNewGame, addLog } from './state/gameState.js';
import { saveGame, loadGame, hasSave, clearSave } from './state/storage.js';
import { renderGame } from './ui/render.js';
import { travel, scavenge } from './core/exploration.js';
import { restAtCamp } from './core/survival.js';
import { playerAttack, useItemInCombat, attemptFlee } from './core/combat.js';
import { craftItem } from './core/crafting.js';
import { useItem } from './core/inventory.js';
import { ITEMS } from './data/items.js';
import { sendPlayerAction } from './core/aiGameMaster.js';
import { loadAiSettings, saveAiSettings } from './state/aiSettings.js';
import { exportSaveToFile, importSaveFromFile } from './state/exportImport.js';

let state = null;
let aiSettings = loadAiSettings();

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const continueBtn = document.getElementById('continue-btn');

if (hasSave()) {
  continueBtn.hidden = false;
}

document.body.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case 'new-game':
      startNewGame();
      return;
    case 'continue-game':
      continueGame();
      return;
    case 'restart':
      clearSave();
      state = null;
      continueBtn.hidden = true;
      gameScreen.hidden = true;
      startScreen.hidden = false;
      return;
    case 'export-save':
      if (state) exportSaveToFile(state);
      return;
  }

  if (!state || state.gameOver) return;

  switch (action) {
    case 'travel':
      await travel(state, target.dataset.target);
      break;
    case 'scavenge':
      await scavenge(state);
      break;
    case 'rest':
      await restAtCamp(state);
      break;
    case 'attack':
      await playerAttack(state);
      break;
    case 'flee':
      await attemptFlee(state);
      break;
    case 'use-item':
      useItem(state, target.dataset.item);
      break;
    case 'use-item-combat':
      await useItemInCombat(state, target.dataset.item);
      break;
    case 'equip-weapon':
      state.player.equippedWeapon = target.dataset.item;
      addLog(state, `You equip the ${ITEMS[target.dataset.item].name}.`);
      break;
    case 'equip-armor':
      state.player.equippedArmor = target.dataset.item;
      addLog(state, `You equip the ${ITEMS[target.dataset.item].name}.`);
      break;
    case 'craft':
      craftItem(state, target.dataset.recipe);
      break;
    default:
      return;
  }

  finishTurn();
});

document.body.addEventListener('change', async (event) => {
  const target = event.target;

  if (target.id === 'ai-mode') {
    aiSettings.mode = target.value;
    saveAiSettings(aiSettings);
    if (state) renderGame(state, aiSettings);
    return;
  }

  if (target.id === 'ai-model') {
    aiSettings.model = target.value;
    saveAiSettings(aiSettings);
    return;
  }

  if (target.id === 'import-save-input') {
    const file = target.files[0];
    if (!file) return;
    try {
      const imported = await importSaveFromFile(file);
      state = imported;
      saveGame(state);
      startScreen.hidden = true;
      gameScreen.hidden = false;
      renderGame(state, aiSettings);
    } catch (err) {
      alert(err.message);
    }
    return;
  }
});

document.body.addEventListener('input', (event) => {
  const target = event.target;

  if (target.id === 'ai-api-key') {
    aiSettings.apiKey = target.value;
    saveAiSettings(aiSettings);
  } else if (target.id === 'ai-custom-model') {
    aiSettings.customModel = target.value;
    saveAiSettings(aiSettings);
  }
});

document.body.addEventListener('submit', async (event) => {
  if (event.target.id !== 'ai-command-form') return;
  event.preventDefault();
  if (!state || state.gameOver) return;

  const input = document.getElementById('ai-command-input');
  const text = input.value.trim();
  if (!text) return;

  const submitBtn = event.target.querySelector('button[type="submit"]');
  input.disabled = true;
  submitBtn.disabled = true;

  try {
    await sendPlayerAction(state, aiSettings, text);
    input.value = '';
  } catch (err) {
    addLog(state, `AI error: ${err.message}`);
  } finally {
    finishTurn();
  }
});

function startNewGame() {
  const nameInput = document.getElementById('player-name');
  state = createNewGame(nameInput.value.trim());
  addLog(state, 'You wake up at the survivor camp. The world outside has changed.');
  startScreen.hidden = true;
  gameScreen.hidden = false;
  finishTurn();
}

function continueGame() {
  state = loadGame();
  if (!state) {
    startNewGame();
    return;
  }
  startScreen.hidden = true;
  gameScreen.hidden = false;
  renderGame(state, aiSettings);
}

function finishTurn() {
  if (state.gameOver) {
    clearSave();
  } else {
    saveGame(state);
  }
  renderGame(state, aiSettings);
}

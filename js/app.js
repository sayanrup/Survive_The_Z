// Application entry point: wires up the start screen, the main game loop
// (via event delegation), and persistence.
import { createNewGame, addLog, addEvent } from './state/gameState.js';
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
import { renderAiSettingsFields } from './ui/aiPanel.js';
import { renderScenarioGrid } from './ui/scenarioPanel.js';
import { SCENARIOS } from './data/scenarios.js';

let state = null;
let aiSettings = loadAiSettings();
let selectedScenarioId = null;
let customStoryText = '';

const startScreen = document.getElementById('start-screen');
const aiSetupScreen = document.getElementById('ai-setup-screen');
const scenarioScreen = document.getElementById('scenario-screen');
const gameScreen = document.getElementById('game-screen');
const continueBtn = document.getElementById('continue-btn');
const screens = [startScreen, aiSetupScreen, scenarioScreen, gameScreen];

const tabContents = {
  home: document.getElementById('tab-home'),
  inventory: document.getElementById('tab-inventory'),
  people: document.getElementById('tab-people'),
  events: document.getElementById('tab-events'),
  settings: document.getElementById('tab-settings'),
};
const tabButtons = document.querySelectorAll('.tab-btn');

if (hasSave()) {
  continueBtn.hidden = false;
}

function showScreen(screen) {
  for (const s of screens) {
    s.hidden = s !== screen;
  }
}

function switchTab(tab) {
  for (const [name, el] of Object.entries(tabContents)) {
    el.hidden = name !== tab;
  }
  tabButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}

function renderAiSetupFields() {
  document.getElementById('ai-setup-fields').innerHTML = renderAiSettingsFields(aiSettings);
}

function renderScenarioScreen() {
  document.getElementById('scenario-grid').innerHTML = renderScenarioGrid(selectedScenarioId);
}

document.body.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case 'show-ai-setup':
      renderAiSetupFields();
      showScreen(aiSetupScreen);
      return;
    case 'show-name':
      showScreen(startScreen);
      return;
    case 'show-scenario':
      renderScenarioScreen();
      showScreen(scenarioScreen);
      return;
    case 'select-scenario':
      selectedScenarioId = selectedScenarioId === target.dataset.scenario ? null : target.dataset.scenario;
      customStoryText = '';
      document.getElementById('custom-story-input').value = '';
      renderScenarioScreen();
      return;
    case 'start-game':
      startNewGame();
      return;
    case 'continue-game':
      continueGame();
      return;
    case 'restart':
      clearSave();
      state = null;
      selectedScenarioId = null;
      customStoryText = '';
      continueBtn.hidden = true;
      showScreen(startScreen);
      return;
    case 'export-save':
      if (state) exportSaveToFile(state);
      return;
    case 'switch-tab':
      switchTab(target.dataset.tab);
      return;
    case 'save-game':
      if (state) {
        saveGame(state);
        addLog(state, 'Game saved.');
        renderGame(state, aiSettings);
      }
      return;
    case 'load-game': {
      const loaded = loadGame();
      if (loaded) {
        state = loaded;
        showScreen(gameScreen);
        switchTab('home');
        renderGame(state, aiSettings);
      }
      return;
    }
    case 'reset-game':
      clearSave();
      state = null;
      selectedScenarioId = null;
      customStoryText = '';
      continueBtn.hidden = true;
      showScreen(startScreen);
      return;
    case 'exit-game':
      if (state) saveGame(state);
      continueBtn.hidden = !hasSave();
      showScreen(startScreen);
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
    if (state) {
      renderGame(state, aiSettings);
    } else {
      renderAiSetupFields();
    }
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
  } else if (target.id === 'custom-story-input') {
    customStoryText = target.value;
    if (target.value.trim() && selectedScenarioId) {
      selectedScenarioId = null;
      document.querySelectorAll('.scenario-card.selected').forEach((el) => el.classList.remove('selected'));
    }
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

function getSelectedScenario() {
  if (customStoryText.trim()) {
    return {
      id: 'custom',
      icon: '📝',
      title: 'Custom Storyline',
      source: 'User-defined',
      setting: 'Custom',
      description: customStoryText.trim(),
      objectives: [],
      threats: [],
      uniqueMechanics: [],
    };
  }
  if (selectedScenarioId) {
    return SCENARIOS.find((s) => s.id === selectedScenarioId) || null;
  }
  return null;
}

function startNewGame() {
  const nameInput = document.getElementById('player-name');
  const scenario = getSelectedScenario();
  state = createNewGame(nameInput.value.trim(), scenario);
  if (scenario) {
    addLog(state, `${scenario.icon ? scenario.icon + ' ' : ''}${scenario.title}`.trim());
    addLog(state, scenario.description);
    addEvent(state, `Story begins: ${scenario.title}`);
  }
  addLog(state, 'You wake up at the survivor camp. The world outside has changed.');
  addEvent(state, 'Woke up at the survivor camp.');
  showScreen(gameScreen);
  switchTab('home');
  finishTurn();
}

function continueGame() {
  state = loadGame();
  if (!state) {
    startNewGame();
    return;
  }
  showScreen(gameScreen);
  switchTab('home');
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
